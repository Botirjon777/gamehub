import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Check, Lock } from "lucide-react";

interface SkinCardProps {
  skin: {
    id: string;
    name: string;
    description: string;
    cost: number;
    previewColor: string;
  };
  isOwned: boolean;
  isSelected: boolean;
  canAfford: boolean;
  onBuy: () => void;
  onSelect: () => void;
}

const SkinCard: React.FC<SkinCardProps> = ({
  skin,
  isOwned,
  isSelected,
  canAfford,
  onBuy,
  onSelect,
}) => {
  return (
    <Card
      className={`p-5 flex flex-col gap-4 group transition-all duration-500 hover:scale-[1.02] ${isSelected ? "border-primary shadow-[0_0_20px_rgba(235,54,75,0.15)] bg-white/10" : "border-white/5 bg-white/5"}`}
    >
      <div
        className="w-full h-32 rounded-2xl shadow-inner relative overflow-hidden"
        style={{ background: skin.previewColor }}
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
        {isSelected && (
          <div className="absolute top-3 right-3 bg-primary text-white p-1.5 rounded-lg shadow-lg">
            <Check size={14} strokeWidth={3} />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">
          {skin.name}
        </h3>
        <p className="text-xs text-white/40 leading-relaxed font-medium">
          {skin.description}
        </p>
      </div>

      <div className="mt-auto">
        {isOwned ? (
          <Button
            variant={isSelected ? "primary" : "ghost"}
            onClick={onSelect}
            className="w-full text-xs font-black uppercase tracking-widest h-10"
          >
            {isSelected ? "Equipped" : "Equip Skin"}
          </Button>
        ) : (
          <Button
            variant="accent"
            onClick={onBuy}
            disabled={!canAfford}
            className="w-full flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest h-10"
          >
            {!canAfford && <Lock size={12} />}${skin.cost.toLocaleString()}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default SkinCard;
