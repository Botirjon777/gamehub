"use server";

import dbConnect from "./mongodb";
import User from "@/models/User";
import Game from "@/models/Game";
import Skin from "@/models/Skin";
import Poster from "@/models/Poster";
import { getCurrentUser, convertToDTO, type UserDTO } from "./auth.actions";
import { revalidatePath } from "next/cache";
import { gamesData } from "./games-data";
import { DINOSAURS, SKINS } from "@/games/mining-adventure/constants";

// Middleware-like check for admin
async function checkAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}

// USER MANAGEMENT
export async function getAllUsers() {
  try {
    await checkAdmin();
    await dbConnect();
    const users = await User.find().sort({ createdAt: -1 });
    return await Promise.all(users.map((u) => convertToDTO(u)));
  } catch (error) {
    console.error("Fetch users error:", error);
    return [];
  }
}

export async function updateUserRole(userId: string, role: "user" | "admin") {
  try {
    await checkAdmin();
    await dbConnect();
    await User.findByIdAndUpdate(userId, { role });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Update role error:", error);
    return { success: false, error: "Failed to update role" };
  }
}

export async function updateUserBalance(userId: string, balance: number) {
  try {
    await checkAdmin();
    await dbConnect();
    await User.findByIdAndUpdate(userId, { balance });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Update balance error:", error);
    return { success: false, error: "Failed to update balance" };
  }
}

// GAME MANAGEMENT
export async function getAllGames() {
  try {
    await dbConnect();
    return await Game.find().sort({ title: 1 });
  } catch (error) {
    console.error("Fetch games error:", error);
    return [];
  }
}

export async function updateGame(gameId: string, data: any) {
  try {
    await checkAdmin();
    await dbConnect();
    await Game.findOneAndUpdate({ id: gameId }, data, { upsert: true });
    revalidatePath("/admin/games");
    revalidatePath("/dashboard");
    revalidatePath("/games");
    return { success: true };
  } catch (error) {
    console.error("Update game error:", error);
    return { success: false, error: "Failed to update game" };
  }
}

// SKIN MANAGEMENT
export async function getAllSkins() {
  try {
    await dbConnect();
    return await Skin.find().sort({ name: 1 });
  } catch (error) {
    console.error("Fetch skins error:", error);
    return [];
  }
}

export async function updateSkin(skinId: string, data: any) {
  try {
    await checkAdmin();
    await dbConnect();
    await Skin.findOneAndUpdate({ id: skinId }, data, { upsert: true });
    revalidatePath("/admin/games");
    return { success: true };
  } catch (error) {
    console.error("Update skin error:", error);
    return { success: false, error: "Failed to update skin" };
  }
}

// POSTER MANAGEMENT
export async function getAllPosters() {
  try {
    await dbConnect();
    return await Poster.find().sort({ order: 1 });
  } catch (error) {
    console.error("Fetch posters error:", error);
    return [];
  }
}

export async function updatePoster(posterId: string | null, data: any) {
  try {
    await checkAdmin();
    await dbConnect();
    if (posterId) {
      await Poster.findByIdAndUpdate(posterId, data);
    } else {
      await Poster.create(data);
    }
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { success: true };
  } catch (error) {
    console.error("Update poster error:", error);
    return { success: false, error: "Failed to update poster" };
  }
}

export async function deletePoster(posterId: string) {
  try {
    await checkAdmin();
    await dbConnect();
    await Poster.findByIdAndDelete(posterId);
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { success: true };
  } catch (error) {
    console.error("Delete poster error:", error);
    return { success: false, error: "Failed to delete poster" };
  }
}

// SEEDING
export async function seedInitialData() {
  try {
    await checkAdmin();
    await dbConnect();

    // Seed Games
    const gameCount = await Game.countDocuments();
    if (gameCount === 0) {
      const gamesToSeed = gamesData.map((g) => ({
        ...g,
        settings: g.id === "mining-adventure" ? { dinosaurs: DINOSAURS } : {},
      }));
      await Game.insertMany(gamesToSeed);
    }

    // Seed Skins
    const skinCount = await Skin.countDocuments();
    if (skinCount === 0) {
      const skinsToSeed = SKINS.map((s) => ({
        ...s,
        gameId: "mining-adventure",
      }));
      await Skin.insertMany(skinsToSeed);
    }

    // Seed Posters
    const posterCount = await Poster.countDocuments();
    if (posterCount === 0) {
      await Poster.create({
        title: "Mining Adventure",
        subtitle: "Build your mining empire today!",
        buttonText: "Play Now",
        buttonLink: "/games/mining-adventure",
        imageUrl: "/games/mining.jpg",
        order: 1,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Seed error:", error);
    return { success: false, error: "Seed failed" };
  }
}
