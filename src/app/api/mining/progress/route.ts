import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import MiningProgress from "@/models/MiningProgress";
import { getCurrentUser } from "@/lib/auth.actions";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const progress = await MiningProgress.findOne({ userId: user.id });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("[MINING_GET_ERROR]:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!user.purchasedGames.includes("mining")) {
      return NextResponse.json(
        { error: "You must own the game to save progress" },
        { status: 403 },
      );
    }

    const body = await req.json();
    await dbConnect();

    try {
      const progress = await MiningProgress.findOneAndUpdate(
        { userId: user.id },
        {
          $set: {
            balance: Number(body.balance),
            ownedDinosaurs: body.ownedDinosaurs,
            lastUpdate: Number(body.lastUpdate),
          },
        },
        { upsert: true, new: true, runValidators: true },
      );

      return NextResponse.json(progress);
    } catch (saveError: any) {
      console.error("[MINING_SAVE_INTERNAL_ERROR]:", {
        message: saveError.message,
        name: saveError.name,
        body: JSON.stringify(body).substring(0, 200), // Log partial body for context
      });
      return NextResponse.json(
        { error: "Failed to save progress: " + saveError.message },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("[MINING_POST_ERROR]:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
