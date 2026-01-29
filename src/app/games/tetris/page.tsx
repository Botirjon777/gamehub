import TetrisGame from "@/games/tetris/components/TetrisGame";

export const metadata = {
  title: "Tetris - GameHub",
  description: "Play the classic Tetris game. Stack blocks and clear lines!",
};

export default function TetrisPage() {
  return <TetrisGame />;
}
