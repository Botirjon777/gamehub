"use client";

import { useEffect, useState } from "react";
import { getAllGames, updateGame } from "@/lib/admin.actions";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Gamepad2, Pickaxe, Settings2, Save } from "lucide-react";

export default function GamesManagement() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  async function fetchGames() {
    setLoading(true);
    const data = await getAllGames();
    setGames(data);
    setLoading(false);
  }

  const handlePriceUpdate = async (gameId: string, currentPrice: number) => {
    const newPrice = prompt("Enter new price:", currentPrice.toString());
    if (newPrice !== null && !isNaN(Number(newPrice))) {
      const res = await updateGame(gameId, { price: Number(newPrice) });
      if (res.success) fetchGames();
      else alert(res.error);
    }
  };

  const toggleStatus = async (
    gameId: string,
    field: string,
    currentValue: boolean,
  ) => {
    const res = await updateGame(gameId, { [field]: !currentValue });
    if (res.success) fetchGames();
    else alert(res.error);
  };

  if (loading) return <div>Loading games...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold mb-2">Games & Store Management</h1>
        <p className="text-white/40">
          Manage prices, availability, and game-specific settings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {games.map((game) => (
          <Card key={game.id} className="p-8 bg-[#0f111a] border-white/5">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-48 h-32 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{game.title}</h3>
                    <p className="text-white/40 text-sm">{game.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">
                      Current Price
                    </p>
                    <p className="text-2xl font-black text-primary">
                      ${game.price}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border border-white/5"
                    onClick={() => handlePriceUpdate(game.id, game.price)}
                  >
                    Change Price
                  </Button>
                  <Button
                    variant={game.comingSoon ? "accent" : "ghost"}
                    size="sm"
                    className="border border-white/5"
                    onClick={() =>
                      toggleStatus(game.id, "comingSoon", game.comingSoon)
                    }
                  >
                    {game.comingSoon ? "Mark Available" : "Set Coming Soon"}
                  </Button>
                  <Button
                    variant={game.isNewArrival ? "primary" : "ghost"}
                    size="sm"
                    className="border border-white/5"
                    onClick={() =>
                      toggleStatus(game.id, "isNewArrival", game.isNewArrival)
                    }
                  >
                    {game.isNewArrival ? "Remove New Badge" : "Mark as New"}
                  </Button>
                </div>

                {game.id === "mining-adventure" && game.settings?.dinosaurs && (
                  <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Settings2 size={20} />
                      <h4 className="font-bold uppercase tracking-wider text-sm">
                        Dino Logic Settings
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {game.settings.dinosaurs.map((dino: any) => (
                        <div
                          key={dino.id}
                          className="p-4 rounded-xl bg-black/40 border border-white/5 text-sm"
                        >
                          <p
                            className="font-bold mb-1"
                            style={{ color: dino.color }}
                          >
                            {dino.name}
                          </p>
                          <div className="flex justify-between text-white/40 text-xs">
                            <span>Cost: ${dino.cost}</span>
                            <span>Income: {dino.incomePerMinute}/min</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-white/20 italic">
                      Note: Advanced dino logic editing coming soon in full
                      editor.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
