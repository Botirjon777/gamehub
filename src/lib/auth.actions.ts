"use server";

import bcrypt from "bcryptjs";
import dbConnect from "./mongodb";
import User, { IUser } from "@/models/User";
import { cookies } from "next/headers";

export interface UserDTO {
  id: string;
  email: string;
  username: string;
  balance: number;
  purchasedGames: string[];
  profileImage: string;
  phoneNumber: string;
  ownedSkins: string[];
  selectedSkins: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  role: "user" | "admin";
}

// Helper to convert Mongoose doc to DTO
export async function convertToDTO(user: IUser): Promise<UserDTO> {
  return {
    id: user._id.toString(),
    email: user.email,
    username: user.username,
    balance: user.balance,
    purchasedGames: user.purchasedGames,
    profileImage: user.profileImage || "",
    phoneNumber: user.phoneNumber || "",
    ownedSkins: user.ownedSkins || ["default"],
    selectedSkins:
      user.selectedSkins instanceof Map
        ? Object.fromEntries(user.selectedSkins)
        : user.selectedSkins || {},
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    role: user.role || "user",
  };
}

// Hash password with bcrypt
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password with bcrypt
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Register a new user
export async function registerUser(
  email: string,
  username: string,
  password: string,
): Promise<{ success: boolean; user?: UserDTO; error?: string }> {
  try {
    await dbConnect();

    // Validate inputs
    if (!email || !username || !password) {
      return { success: false, error: "All fields are required" };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters",
      };
    }

    // Check if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return { success: false, error: "Email already registered" };
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return { success: false, error: "Username already taken" };
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create new user
    const newUser = await User.create({
      email,
      username,
      passwordHash,
    });

    const userDTO: UserDTO = await convertToDTO(newUser);

    // Set cookie for session (simplistic version for now)
    const cookieStore = await cookies();
    cookieStore.set("currentUser", JSON.stringify(userDTO), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true, user: userDTO };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Registration failed. Please try again." };
  }
}

// Login user
export async function loginUser(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: UserDTO; error?: string }> {
  try {
    await dbConnect();

    // Validate inputs
    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return { success: false, error: "Invalid email or password" };
    }

    const userDTO: UserDTO = await convertToDTO(user);

    // Set cookie for session
    const cookieStore = await cookies();
    cookieStore.set("currentUser", JSON.stringify(userDTO), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { success: true, user: userDTO };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Login failed. Please try again." };
  }
}

// Logout user
export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("currentUser");
}

// Get current user (Database Truth)
export async function getCurrentUser(): Promise<UserDTO | null> {
  const cookieStore = await cookies();
  const stored = cookieStore.get("currentUser");

  if (!stored) return null;

  try {
    const sessionUser = JSON.parse(stored.value);

    await dbConnect();
    const user = await User.findById(sessionUser.id);

    if (!user) {
      cookieStore.delete("currentUser");
      return null;
    }

    const userDTO = await convertToDTO(user);

    // Optionally update cookie if it's vastly different (for next immediate read)
    // but the next read will also hit DB, so it's fine.

    return userDTO;
  } catch (error) {
    console.error("GetCurrentUser error:", error);
    return null;
  }
}
