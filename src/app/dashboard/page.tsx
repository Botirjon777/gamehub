"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Gamepad2, Trophy, Star, BarChart3 } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import Card from "@/components/ui/Card";
import StatsCard from "@/components/dashboard/StatsCard";
import GameCard from "@/components/games/GameCard";
import { gamesData } from "@/lib/games-data";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isInitialized, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/login");
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized || (isAuthenticated && !user)) {
    return (
      <div className="min-h-screen bg-[#0f111a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const stats = {
    balance: user.balance,
    gamesOwned: user.purchasedGames.length,
    totalScore: 0,
    rank: "Beginner",
  };

  const myGames = gamesData.filter((g) => user.purchasedGames.includes(g.id));
  const featuredGames = gamesData
    .filter((g) => !user.purchasedGames.includes(g.id))
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-20">
      {/* Welcome Section */}
      <div className="mb-12 animate-slide-up flex justify-between items-end">
        <div>
          <h1 className="mb-2">Welcome back, {user.username}! 👋</h1>
          <p className="text-xl text-muted-foreground">
            Ready to continue your gaming adventure?
          </p>
        </div>
        <div className="bg-primary/10 px-6 py-4 rounded-2xl border border-primary/20">
          <p className="text-sm text-primary font-bold uppercase tracking-wider mb-1">
            Your Balance
          </p>
          <p className="text-3xl font-black text-foreground">
            ${user.balance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatsCard
          icon={<Gamepad2 className="w-10 h-10 text-primary" />}
          title="Games Owned"
          value={stats.gamesOwned}
          subtitle="Unlocked in your library"
        />
        <StatsCard
          icon={<Trophy className="w-10 h-10 text-primary" />}
          title="Total Score"
          value={stats.totalScore.toLocaleString()}
          subtitle="Across all games"
        />
        <StatsCard
          icon={<Star className="w-10 h-10 text-primary" />}
          title="Achievements"
          value={0}
          subtitle="Unlock more by playing"
        />
        <StatsCard
          icon={<BarChart3 className="w-10 h-10 text-primary" />}
          title="Rank"
          value={stats.rank}
          subtitle="Keep playing to rank up"
        />
      </div>

      {/* My Games Section */}
      {myGames.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">My Library</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      )}

      {/* Featured Games / Store */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured in Store</h2>
          <Link href="/games">
            <Button variant="ghost" size="sm">
              Explore All →
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
}
