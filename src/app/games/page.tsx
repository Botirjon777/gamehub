"use client";

import { useState } from "react";
import { Gamepad2, Joystick, Puzzle, Swords, Pickaxe } from "lucide-react";
import GameCard from "@/components/games/GameCard";
import { gamesData } from "@/lib/games-data";

export default function GamesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Games", Icon: Gamepad2 },
    { id: "arcade", label: "Arcade", Icon: Joystick },
    { id: "puzzle", label: "Puzzle", Icon: Puzzle },
    { id: "strategy", label: "Strategy", Icon: Swords },
    { id: "mining", label: "Mining", Icon: Pickaxe },
  ];

  const filteredGames =
    selectedCategory === "all"
      ? gamesData
      : gamesData.filter((game) => game.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-20">
      {/* Header */}
      <div className="text-center mb-12 animate-slide-up">
        <h1 className="mb-4">Game Library</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose from our collection of classic and modern games. More games
          coming soon!
        </p>
      </div>

      {/* Category Filter */}
      <div
        className="flex flex-wrap justify-center gap-3 mb-12 animate-slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`glass px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:glass-strong ${
              selectedCategory === category.id
                ? "glass-strong ring-2 ring-primary"
                : ""
            }`}
          >
            <category.Icon className="w-5 h-5 mr-2 inline" />
            {category.label}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game, index) => (
          <div
            key={game.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">
            No games found in this category.
          </p>
        </div>
      )}
    </div>
  );
}
