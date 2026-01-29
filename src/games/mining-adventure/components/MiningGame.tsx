"use client";

import React, { useEffect } from "react";
import { useMiningStore } from "../stores/useMiningStore";
import { DINOSAURS } from "../constants";
import DinoCard from "./DinoCard";
import Badge from "@/components/ui/Badge";
import { Pickaxe, TrendingUp, Wallet, Clock } from "lucide-react";

const MiningGame: React.FC = () => {
  const {
    balance,
    ownedDinosaurs,
    collectIncome,
    buyDino,
    getIncomePerMinute,
    lastUpdate,
    syncToServer,
    loadFromServer,
    isLoading,
    boostEndTime,
    lastBoostTime,
    activateBoost,
  } = useMiningStore();

  const [timeLeft, setTimeLeft] = React.useState(0);
  const [cooldownLeft, setCooldownLeft] = React.useState(0);

  // Load from server on mount
  useEffect(() => {
    const init = async () => {
      await loadFromServer();
      collectIncome(); // Immediate catch up after DB load
    };
    init();
  }, [loadFromServer, collectIncome]);

  // Combined Boost & Cooldown timer
  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();

      // Boost remaining time
      if (boostEndTime) {
        const remaining = Math.max(0, Math.ceil((boostEndTime - now) / 1000));
        setTimeLeft(remaining);
      } else {
        setTimeLeft(0);
      }

      // Cooldown remaining time (12 hours)
      if (lastBoostTime) {
        const COOLDOWN = 12 * 60 * 60 * 1000;
        const remainingMs = Math.max(0, lastBoostTime + COOLDOWN - now);
        setCooldownLeft(Math.ceil(remainingMs / 1000));
      } else {
        setCooldownLeft(0);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [boostEndTime, lastBoostTime]);

  const formatCooldown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  // Sync income every 5 seconds and push to server every 15 seconds
  useEffect(() => {
    const incomeTimer = setInterval(() => {
      collectIncome();
    }, 5000);

    const syncTimer = setInterval(() => {
      syncToServer();
    }, 15000);

    return () => {
      clearInterval(incomeTimer);
      clearInterval(syncTimer);
    };
  }, [collectIncome, syncToServer]);

  const incomePerMinute = getIncomePerMinute();
  const isBoostActive = timeLeft > 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] glass rounded-3xl border border-white/10 p-12 animate-pulse">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-xl font-bold text-white uppercase tracking-widest">
          Syncing Progress...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="glass p-6 rounded-2xl border border-white/10 flex items-center gap-6">
          <div className="p-4 bg-yellow-500/10 rounded-xl">
            <Wallet className="w-8 h-8 text-yellow-500" />
          </div>
          <div>
            <p className="text-white/40 text-sm font-medium uppercase tracking-wider">
              Balance
            </p>
            <p className="text-3xl font-black text-white">
              ${balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/10 flex items-center gap-6">
          <div className="p-4 bg-green-500/10 rounded-xl">
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <p className="text-white/40 text-sm font-medium uppercase tracking-wider">
              Income
            </p>
            <p
              className={`text-3xl font-black ${isBoostActive ? "text-primary animate-pulse" : "text-green-400"}`}
            >
              +${(incomePerMinute * (isBoostActive ? 5 : 1)).toLocaleString()}
              /min
            </p>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/10 flex items-center gap-6">
          <div className="p-4 bg-primary/10 rounded-xl">
            <Pickaxe className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-white/40 text-sm font-medium uppercase tracking-wider">
              Total Miners
            </p>
            <p className="text-3xl font-black text-white">
              {ownedDinosaurs.length}
            </p>
          </div>
        </div>

        {/* Boost Section */}
        <div
          className={`p-1 rounded-2xl transition-all duration-500 ${isBoostActive ? "gradient-primary shadow-[0_0_30px_rgba(235,54,75,0.3)]" : "bg-white/5"}`}
        >
          <div className="bg-[#1a1c2a] h-full w-full rounded-xl p-5 flex flex-col justify-center">
            {isBoostActive ? (
              <div className="text-center space-y-1">
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                  5X BOOST ACTIVE
                </p>
                <p className="text-4xl font-black text-white tabular-nums">
                  0:{timeLeft.toString().padStart(2, "0")}
                </p>
              </div>
            ) : cooldownLeft > 0 ? (
              <div className="text-center space-y-2 py-1">
                <div className="flex items-center justify-center gap-2 text-white/20">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    ON COOLDOWN
                  </span>
                </div>
                <p className="text-lg font-black text-white/40 tabular-nums">
                  {formatCooldown(cooldownLeft)}
                </p>
              </div>
            ) : (
              <button
                onClick={activateBoost}
                className="group w-full h-full flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform py-1"
              >
                <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/40 transition-colors">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-widest text-primary">
                  Boost 5x
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
          Marketplace
        </h2>
        <Badge variant="outline" className="opacity-60">
          Buy Dinosaurs
        </Badge>
      </div>

      {/* Dinosaur Shop Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {DINOSAURS.map((dino) => {
          const count = ownedDinosaurs.filter((o) => o.type === dino.id).length;
          const canAfford = balance >= dino.cost;

          return (
            <DinoCard
              key={dino.id}
              config={dino}
              count={count}
              onBuy={() => buyDino(dino.id)}
              canAfford={canAfford}
            />
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-sm font-medium">
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>Last updated: {new Date(lastUpdate).toLocaleTimeString()}</span>
        </div>
        <p>
          Mining proceeds are automatically calculated even when you are
          offline.
        </p>
      </div>
    </div>
  );
};

export default MiningGame;
