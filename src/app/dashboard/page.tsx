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
  const { user, isAuthenticated, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null; // or a loading spinner
  }

  // Mock stats for now - will be replaced with real data later
  const stats = {
    gamesPlayed: 0,
    totalScore: 0,
    achievements: 0,
    rank: "Beginner",
  };

  const recentGames = gamesData.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-20">
      {/* Welcome Section */}
      <div className="mb-12 animate-slide-up">
        <h1 className="mb-2">Welcome back, {user.username}! 👋</h1>
        <p className="text-xl text-muted-foreground">
          Ready to continue your gaming adventure?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatsCard
          icon={<Gamepad2 className="w-10 h-10 text-primary" />}
          title="Games Played"
          value={stats.gamesPlayed}
          subtitle="Start playing to track stats"
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
          value={stats.achievements}
          subtitle="Unlock more by playing"
        />
        <StatsCard
          icon={<BarChart3 className="w-10 h-10 text-primary" />}
          title="Rank"
          value={stats.rank}
          subtitle="Keep playing to rank up"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hover className="text-center p-8">
            <Gamepad2 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Browse Games</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Explore our full game library
            </p>
            <Link href="/games">
              <Button variant="primary" size="sm">
                View All Games
              </Button>
            </Link>
          </Card>

          <Card hover className="text-center p-8">
            <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Leaderboards</h3>
            <p className="text-sm text-muted-foreground mb-4">
              See how you rank globally
            </p>
            <Button variant="ghost" size="sm" disabled>
              Coming Soon
            </Button>
          </Card>

          <Card hover className="text-center p-8">
            <Star className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Achievements</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Track your progress
            </p>
            <Button variant="ghost" size="sm" disabled>
              Coming Soon
            </Button>
          </Card>
        </div>
      </div>

      {/* Featured Games */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Games</h2>
          <Link href="/games">
            <Button variant="ghost" size="sm">
              View All →
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
}
