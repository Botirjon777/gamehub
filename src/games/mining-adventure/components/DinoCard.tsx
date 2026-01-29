import React from "react";
import { DinosaurConfig } from "../types";
import DinoIcon from "./DinoIcon";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface DinoCardProps {
  config: DinosaurConfig;
  count: number;
  onBuy: () => void;
  canAfford: boolean;
  selectedSkinId?: string | null;
}

const DinoCard: React.FC<DinoCardProps> = ({
  config,
  count,
  onBuy,
  canAfford,
  selectedSkinId = "default",
}) => {
  // Apply skin-based color modifications
  let displayColor = config.color;
  let glowStyle = {};

  if (selectedSkinId === "mining-neon") {
    displayColor = "#f0f"; // Magenta glow for neon
    glowStyle = { boxShadow: `0 0 20px rgba(255, 0, 255, 0.4)` };
  } else if (selectedSkinId === "mining-gold") {
    displayColor = "#fbbf24"; // Gold color
    glowStyle = { boxShadow: `0 0 15px rgba(251, 191, 36, 0.3)` };
  } else if (selectedSkinId === "mining-void") {
    displayColor = "#818cf8"; // Deep indigo for void
    glowStyle = { filter: "brightness(0.7) contrast(1.2)" };
  }

  return (
    <div
      className={`glass p-6 rounded-2xl border transition-all group ${selectedSkinId !== "mining-classic" ? "border-primary/20" : "border-white/10"}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-4 rounded-xl shadow-lg transition-transform group-hover:scale-110"
          style={{
            backgroundColor: `${displayColor}20`,
            border: `1px solid ${displayColor}40`,
            ...glowStyle,
          }}
        >
          <DinoIcon
            type={config.id}
            color={displayColor}
            className="w-12 h-12"
          />
        </div>
        {count > 0 && (
          <Badge variant="primary" className="text-sm px-4">
            x{count}
          </Badge>
        )}
      </div>

      <h3 className="text-xl font-bold mb-1 text-white">{config.name}</h3>
      <p className="text-sm text-white/40 mb-4 line-clamp-2 h-10 italic">
        {config.description}
      </p>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Income</span>
          <span className="text-green-400 font-bold">
            +${config.incomePerMinute}/min
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Cost</span>
          <span className="text-yellow-400 font-bold">
            ${config.cost.toLocaleString()}
          </span>
        </div>
      </div>

      <Button
        variant={canAfford ? "primary" : "ghost"}
        size="sm"
        className="w-full"
        onClick={onBuy}
        disabled={!canAfford}
      >
        {canAfford ? "Buy Miner" : "Insufficient Funds"}
      </Button>
    </div>
  );
};

export default DinoCard;
