"use server";

import dbConnect from "./mongodb";
import User from "@/models/User";
import { getCurrentUser, convertToDTO, UserDTO } from "./auth.actions";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateProfile(data: {
  username?: string;
  email?: string;
  phoneNumber?: string;
  profileImage?: string;
}) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return { success: false, error: "Unauthorized" };
    }

    await dbConnect();

    const user = await User.findById(authUser.id);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    console.log("[UPDATE_PROFILE_REQUEST]:", {
      id: user._id,
      incoming: data,
    });

    const updateData: any = {};

    if (data.username && data.username !== user.username) {
      // Check if username is taken by someone else
      const existing = await User.findOne({
        username: data.username,
        _id: { $ne: user._id },
      });
      if (existing) {
        return { success: false, error: "Username already taken" };
      }
      updateData.username = data.username;
    }

    if (data.email && data.email !== user.email) {
      // Check if email is taken by someone else
      const existing = await User.findOne({
        email: data.email,
        _id: { $ne: user._id },
      });
      if (existing) {
        return { success: false, error: "Email already taken" };
      }
      updateData.email = data.email;
    }

    if (data.phoneNumber !== undefined) {
      console.log("[SETTING_PHONE]:", data.phoneNumber);
      updateData.phoneNumber = data.phoneNumber;
    }

    if (data.profileImage !== undefined) {
      updateData.profileImage = data.profileImage;
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return { success: false, error: "Failed to update user" };
    }

    console.log(
      "[USER_UPDATED]:",
      updatedUser.username,
      "Phone:",
      updatedUser.phoneNumber,
    );

    const userDTO = await convertToDTO(updatedUser);
    const cookieStore = await cookies();
    cookieStore.set("currentUser", JSON.stringify(userDTO), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    revalidatePath("/dashboard");
    revalidatePath("/profile");

    return { success: true, user: userDTO };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function topUpBalance(amount: number) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return { success: false, error: "Unauthorized" };
    }

    if (amount <= 0) {
      return { success: false, error: "Amount must be greater than 0" };
    }

    await dbConnect();

    const user = await User.findById(authUser.id);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    user.balance += amount;
    await user.save();

    const userDTO = await convertToDTO(user);
    const cookieStore = await cookies();
    cookieStore.set("currentUser", JSON.stringify(userDTO), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    revalidatePath("/dashboard");
    revalidatePath("/profile");

    return { success: true, user: userDTO };
  } catch (error) {
    console.error("Top up error:", error);
    return { success: false, error: "Failed to top up balance" };
  }
}
