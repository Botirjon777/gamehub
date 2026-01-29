"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import MiningGame from "@/games/mining-adventure/components/MiningGame";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Button from "@/components/ui/Button";

export default function MiningAdventurePage() {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/login?redirect=/games/mining-adventure");
    }
  }, [isInitialized, isAuthenticated, router]);

  const isOwned = user?.purchasedGames.includes("mining");

  if (!isInitialized || (isAuthenticated && !user)) {
    return (
      <div className="min-h-screen bg-[#0f111a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  if (!isOwned) {
    return (
      <div className="min-h-screen bg-[#0f111a] text-white flex items-center justify-center">
        <div className="text-center p-8 glass rounded-3xl border border-white/10 max-w-md">
          <h2 className="text-3xl font-bold mb-4">Game Not Owned</h2>
          <p className="text-white/60 mb-8">
            You need to purchase Mining Adventure from the store to play.
          </p>
          <Link href="/dashboard">
            <Button variant="primary">Go to Store</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f111a] text-white">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-6xl font-black mb-4 bg-linear-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent uppercase tracking-tighter">
            Mining Adventure
          </h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto font-medium">
            Build your dinosaur mining empire. Buy miners, earn passive income,
            and become the tycoon of the prehistoric age!
          </p>
        </div>

        <MiningGame />
      </div>
    </div>
  );
}
