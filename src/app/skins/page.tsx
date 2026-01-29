"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { GLOBAL_SKINS, GlobalSkin } from "@/lib/skins-data";
import { buySkin, equipSkin } from "@/lib/skins.actions";
import { GAMES } from "@/lib/games-data";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Check, Lock, Sparkles, Gamepad2, Wallet, Zap } from "lucide-react";

export default function SkinsPage() {
  const { user, setUser } = useAuthStore();
  const [selectedGameId, setSelectedGameId] =
    useState<string>("mining-adventure");
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Filter skins for the selected game
  const filteredSkins = GLOBAL_SKINS.filter((s) => s.gameId === selectedGameId);
  const selectedGame = GAMES.find((g) => g.id === selectedGameId);

  const handleBuy = async (skinId: string) => {
    setLoading(skinId);
    setMessage(null);
    const result = await buySkin(skinId);
    if (result.success && result.user) {
      setUser(result.user);
      setMessage({ type: "success", text: "Skin purchased and equipped!" });
    } else {
      setMessage({ type: "error", text: result.error || "Purchase failed" });
    }
    setLoading(null);
  };

  const handleEquip = async (skinId: string) => {
    setLoading(skinId);
    setMessage(null);
    const result = await equipSkin(selectedGameId, skinId);
    if (result.success && result.user) {
      setUser(result.user);
      setMessage({ type: "success", text: "Skin equipped!" });
    } else {
      setMessage({ type: "error", text: result.error || "Equip failed" });
    }
    setLoading(null);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden flex items-center justify-center mb-12">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-transparent" />
        <div className="relative text-center space-y-4 px-4">
          <Badge
            variant="primary"
            className="px-6 py-1 text-xs tracking-[0.3em] uppercase animate-pulse"
          >
            Visual Enhancements
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
            Skins <span className="text-primary italic">Market</span>
          </h1>
          <p className="text-white/40 max-w-lg mx-auto font-medium leading-relaxed">
            Upgrade your gameplay visuals and gain massive income boosts across
            your favorite titles.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Game Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {GAMES.filter((g) => GLOBAL_SKINS.some((s) => s.gameId === g.id)).map(
            (game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGameId(game.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-300 border ${
                  selectedGameId === game.id
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105"
                    : "glass border-white/5 text-white/40 hover:text-white hover:border-white/10"
                }`}
              >
                <Gamepad2 className="w-5 h-5" />
                <span className="font-black uppercase tracking-widest text-sm">
                  {game.title}
                </span>
              </button>
            ),
          )}
        </div>

        {/* Feedback Message */}
        {message && (
          <div
            className={`max-w-xl mx-auto mb-8 p-4 rounded-xl text-center font-bold text-sm uppercase tracking-widest animate-in slide-in-from-top duration-500 ${
              message.type === "success"
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredSkins.map((skin) => {
            const isOwned = user.ownedSkins.includes(skin.id);
            const isSelected =
              user.selectedSkins[selectedGameId] === skin.id ||
              (skin.id === "mining-classic" &&
                !user.selectedSkins[selectedGameId]);
            const canAfford = user.balance >= skin.cost;
            const isLoading = loading === skin.id;

            return (
              <Card
                key={skin.id}
                className={`p-1 rounded-[2.5rem] transition-all duration-700 ${isSelected ? "gradient-primary shadow-[0_0_40px_rgba(235,54,75,0.2)]" : "bg-white/5 hover:bg-white/10"}`}
              >
                <div className="bg-[#0f111a] rounded-[2.2rem] p-6 h-full flex flex-col gap-6">
                  {/* Preview Box */}
                  <div
                    className="w-full h-48 rounded-[1.8rem] relative overflow-hidden group shadow-inner"
                    style={{ background: skin.previewColor }}
                  >
                    <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100">
                      <Sparkles className="text-white w-12 h-12" />
                    </div>
                    {isOwned && (
                      <div className="absolute bottom-4 left-4 glass px-3 py-1 rounded-full text-[10px] font-black text-white/80 uppercase tracking-widest">
                        Owned
                      </div>
                    )}
                    {skin.multiplier > 1 && (
                      <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                        <Zap size={10} strokeWidth={3} />
                        {skin.multiplier}x Boost
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                      {skin.name}
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed font-medium">
                      {skin.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                        Price
                      </span>
                      <span className="text-lg font-black text-white">
                        {skin.cost === 0
                          ? "FREE"
                          : `$${skin.cost.toLocaleString()}`}
                      </span>
                    </div>

                    {isOwned ? (
                      <Button
                        variant={isSelected ? "primary" : "ghost"}
                        onClick={() => handleEquip(skin.id)}
                        disabled={isSelected || isLoading}
                        className={`h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-xs ${isSelected && "opacity-50"}`}
                      >
                        {isSelected ? "Active" : "Equip"}
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => handleBuy(skin.id)}
                        disabled={!canAfford || isLoading}
                        className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2"
                      >
                        {!canAfford && <Lock size={12} />}
                        Buy
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
