import Link from "next/link";
import {
  Gamepad2,
  Puzzle,
  Swords,
  Joystick,
  Pickaxe,
  Lock,
} from "lucide-react";
import { Game } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useAuthStore } from "@/stores/useAuthStore";
import { purchaseGame } from "@/lib/purchase.actions";
import { useState } from "react";
import { LEGACY_GAME_IDS } from "@/lib/games-data";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const { user, setUser } = useAuthStore();
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Check ownership including legacy IDs
  const isOwned =
    game.price === 0 ||
    user?.purchasedGames.includes(game.id) ||
    Object.entries(LEGACY_GAME_IDS).some(
      ([oldId, newId]) =>
        newId === game.id && user?.purchasedGames.includes(oldId),
    );
  const canPlay = isOwned && !game.comingSoon;

  const handlePurchase = async () => {
    if (!user) return;
    setIsPurchasing(true);
    const result = await purchaseGame(game.id);
    if (result.success && result.user) {
      setUser(result.user); // Instantly update frontend state
    } else if (!result.success) {
      alert(result.error);
    }
    setIsPurchasing(false);
  };

  return (
    <Card hover className="overflow-hidden group">
      <div className="relative h-48 bg-linear-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        {getCategoryIcon(game.category)}

        {!isOwned && !game.comingSoon && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Lock className="w-12 h-12 text-white/50" />
          </div>
        )}

        {game.isNewArrival && (
          <Badge variant="primary" pulse className="absolute top-2 left-2">
            NEW
          </Badge>
        )}

        {game.comingSoon && (
          <Badge variant="glass-strong" className="absolute top-2 right-2">
            Coming Soon
          </Badge>
        )}

        {!isOwned && !game.comingSoon && (
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 font-black"
          >
            ${game.price}
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-semibold mb-1">{game.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {game.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="glass" className="capitalize">
            {game.category}
          </Badge>

          {game.comingSoon ? (
            <Button variant="ghost" size="sm" disabled>
              Coming Soon
            </Button>
          ) : isOwned ? (
            <Link href={game.route}>
              <Button variant="primary" size="sm">
                Play Now
              </Button>
            </Link>
          ) : (
            <Button
              variant="accent"
              size="sm"
              onClick={handlePurchase}
              isLoading={isPurchasing}
            >
              Buy for ${game.price}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function getCategoryIcon(category: string): React.ReactElement {
  const iconClass = "w-16 h-16 text-primary";
  const icons: Record<string, React.ReactElement> = {
    puzzle: <Puzzle className={iconClass} />,
    strategy: <Swords className={iconClass} />,
    arcade: <Joystick className={iconClass} />,
    mining: <Pickaxe className={iconClass} />,
  };
  return icons[category] || <Gamepad2 className={iconClass} />;
}
