"use server";

import dbConnect from "./mongodb";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { getCurrentUser, convertToDTO, type UserDTO } from "./auth.actions";
import { gamesData, LEGACY_GAME_IDS } from "./games-data";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function purchaseGame(gameId: string) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return {
        success: false,
        error: "You must be logged in to purchase games",
      };
    }

    await dbConnect();

    const user = await User.findById(authUser.id);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Check if already owned (including legacy IDs)
    const alreadyOwned =
      user.purchasedGames.includes(gameId) ||
      Object.entries(LEGACY_GAME_IDS).some(
        ([oldId, newId]) =>
          newId === gameId && user.purchasedGames.includes(oldId),
      );

    if (alreadyOwned) {
      return { success: false, error: "You already own this game" };
    }

    // Get game info
    const game = gamesData.find((g) => g.id === gameId);
    if (!game) {
      return { success: false, error: "Game not found" };
    }

    // Check balance
    if (user.balance < game.price) {
      return { success: false, error: "Insufficient balance" };
    }

    // Perform transaction
    user.balance -= game.price;
    user.purchasedGames.push(gameId);

    // Create transaction record
    await Transaction.create({
      userId: user._id,
      gameId: gameId,
      amount: game.price,
      type: "purchase",
      status: "completed",
    });

    await user.save();

    // Update cookie with new balance and purchased games
    const userDTO: UserDTO = await convertToDTO(user);
    const cookieStore = await cookies();
    cookieStore.set("currentUser", JSON.stringify(userDTO), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    revalidatePath("/dashboard");
    revalidatePath("/games");

    return { success: true, user: userDTO };
  } catch (error) {
    console.error("Purchase error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during purchase",
    };
  }
}

export async function getUserProfile() {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) return null;

    await dbConnect();
    const user = await User.findById(authUser.id).select("-passwordHash");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Fetch profile error:", error);
    return null;
  }
}
