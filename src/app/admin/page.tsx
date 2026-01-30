"use client";

import { useEffect, useState } from "react";
import { getAllUsers, getAllGames, seedInitialData } from "@/lib/admin.actions";
import Card from "@/components/ui/Card";
import {
  Users,
  Gamepad2,
  Coins,
  TrendingUp,
  Image as ImageIcon,
  Settings,
} from "lucide-react";
import Button from "@/components/ui/Button";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    games: 0,
    totalBalance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [users, games] = await Promise.all([getAllUsers(), getAllGames()]);
      setStats({
        users: users.length,
        games: games.length,
        totalBalance: users.reduce((acc, u) => acc + u.balance, 0),
      });
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSeed = async () => {
    if (confirm("Are you sure you want to seed initial data?")) {
      const res = await seedInitialData();
      if (res.success) {
        alert("Seed successful!");
        window.location.reload();
      } else {
        alert("Seed failed: " + res.error);
      }
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-white/40">
            Welcome to the GameHub administration area.
          </p>
        </div>
        <Button
          variant="ghost"
          className="border border-white/10"
          onClick={handleSeed}
        >
          Seed Initial Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-[#0f111a] border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500">
              <Users size={24} />
            </div>
            <div>
              <p className="text-white/40 text-sm font-medium uppercase tracking-wider">
                Total Users
              </p>
              <h3 className="text-3xl font-bold">{stats.users}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#0f111a] border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-500">
              <Gamepad2 size={24} />
            </div>
            <div>
              <p className="text-white/40 text-sm font-medium uppercase tracking-wider">
                Total Games
              </p>
              <h3 className="text-3xl font-bold">{stats.games}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#0f111a] border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-500">
              <Coins size={24} />
            </div>
            <div>
              <p className="text-white/40 text-sm font-medium uppercase tracking-wider">
                User Balance Sum
              </p>
              <h3 className="text-3xl font-bold">
                ${stats.totalBalance.toLocaleString()}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-8 bg-[#0f111a] border-white/5 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <TrendingUp size={32} />
          </div>
          <h2 className="text-2xl font-bold">Platform Status: Online</h2>
          <p className="text-white/60">
            All systems are running smoothly. Database connection is active.
          </p>
        </Card>

        <Card className="p-8 bg-[#0f111a] border-white/5">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="primary" className="w-full justify-start gap-3">
              <Users size={18} /> Manage Users
            </Button>
            <Button variant="accent" className="w-full justify-start gap-3">
              <Gamepad2 size={18} /> Update Game Prices
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 border border-white/5"
            >
              <ImageIcon size={18} /> Edit Banners
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 border border-white/5"
            >
              <Settings size={18} /> System Config
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
