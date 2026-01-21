import Link from "next/link";
import Image from "next/image";
import { Gamepad2, Puzzle, Swords, Joystick, Pickaxe } from "lucide-react";
import { Game } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Card hover className="overflow-hidden">
      <div className="relative h-48 bg-linear-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
        {getCategoryIcon(game.category)}
        {game.isNew && (
          <div className="absolute top-2 left-2 gradient-primary px-3 py-1 rounded-full text-xs font-bold text-white animate-pulse">
            NEW
          </div>
        )}
        {game.comingSoon && (
          <div className="absolute top-2 right-2 glass-strong px-3 py-1 rounded-full text-xs font-semibold">
            Coming Soon
          </div>
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
          <span className="text-xs glass px-3 py-1 rounded-full capitalize">
            {game.category}
          </span>
          {game.comingSoon ? (
            <Button variant="ghost" size="sm" disabled>
              Coming Soon
            </Button>
          ) : (
            <Link href={game.route}>
              <Button variant="primary" size="sm">
                Play Now
              </Button>
            </Link>
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
