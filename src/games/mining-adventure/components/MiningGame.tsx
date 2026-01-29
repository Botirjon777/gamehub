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
  } = useMiningStore();

  // Load from server on mount
  useEffect(() => {
    const init = async () => {
      await loadFromServer();
      collectIncome(); // Immediate catch up after DB load
    };
    init();
  }, [loadFromServer, collectIncome]);

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
            <p className="text-3xl font-black text-green-400">
              +${incomePerMinute.toLocaleString()}/min
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
