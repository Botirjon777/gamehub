"use server";

import dbConnect from "./mongodb";
import User, { IUser } from "@/models/User";
import { getCurrentUser, convertToDTO, UserDTO } from "./auth.actions";
import { GLOBAL_SKINS } from "./skins-data";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function buySkin(skinId: string) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) return { success: false, error: "Unauthorized" };

    const skin = GLOBAL_SKINS.find((s) => s.id === skinId);
    if (!skin) return { success: false, error: "Skin not found" };

    await dbConnect();
    const user = await User.findById(authUser.id);
    if (!user) return { success: false, error: "User not found" };

    if (user.ownedSkins.includes(skinId)) {
      return { success: false, error: "Already owned" };
    }

    if (user.balance < skin.cost) {
      return { success: false, error: "Insufficient balance" };
    }

    user.balance -= skin.cost;
    user.ownedSkins.push(skinId);

    // Auto equip
    user.selectedSkins.set(skin.gameId, skinId);

    await user.save();

    const userDTO = await convertToDTO(user);
    const cookieStore = await cookies();
    cookieStore.set("currentUser", JSON.stringify(userDTO), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    revalidatePath("/skins");
    revalidatePath("/dashboard");
    revalidatePath("/profile");
    revalidatePath(`/games/${skin.gameId}`);

    return { success: true, user: userDTO };
  } catch (error) {
    console.error("Buy skin error:", error);
    return { success: false, error: "Failed to buy skin" };
  }
}

export async function equipSkin(gameId: string, skinId: string) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) return { success: false, error: "Unauthorized" };

    await dbConnect();
    const user = await User.findById(authUser.id);
    if (!user) return { success: false, error: "User not found" };

    if (!user.ownedSkins.includes(skinId)) {
      return { success: false, error: "You don't own this skin" };
    }

    user.selectedSkins.set(gameId, skinId);
    await user.save();

    const userDTO = await convertToDTO(user);
    const cookieStore = await cookies();
    cookieStore.set("currentUser", JSON.stringify(userDTO), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    revalidatePath("/skins");
    revalidatePath(`/games/${gameId}`);

    return { success: true, user: userDTO };
  } catch (error) {
    console.error("Equip skin error:", error);
    return { success: false, error: "Failed to equip skin" };
  }
}
