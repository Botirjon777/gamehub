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
}

const DinoCard: React.FC<DinoCardProps> = ({
  config,
  count,
  onBuy,
  canAfford,
}) => {
  return (
    <div className="glass p-6 rounded-2xl border border-white/10 hover:glass-strong transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-4 rounded-xl shadow-lg transition-transform group-hover:scale-110"
          style={{
            backgroundColor: `${config.color}20`,
            border: `1px solid ${config.color}40`,
          }}
        >
          <DinoIcon
            type={config.id}
            color={config.color}
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
