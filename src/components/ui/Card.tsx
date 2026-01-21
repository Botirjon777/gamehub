import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}

export default function Card({
  children,
  className,
  hover = false,
  style,
}: CardProps) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-6 transition-all duration-300",
        hover &&
          "hover:glass-strong hover:scale-105 hover:shadow-xl cursor-pointer",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
