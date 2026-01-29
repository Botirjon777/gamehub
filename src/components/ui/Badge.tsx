import React from "react";

type BadgeVariant =
  | "primary"
  | "secondary"
  | "glass"
  | "glass-strong"
  | "outline";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  pulse?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "glass",
  className = "",
  pulse = false,
}) => {
  const baseStyles = "px-3 py-1 rounded-full text-xs font-bold transition-all";

  const variants: Record<BadgeVariant, string> = {
    primary: "gradient-primary text-white",
    secondary: "gradient-secondary text-white",
    glass: "glass text-white/80",
    "glass-strong": "glass-strong text-white font-semibold",
    outline: "border border-white/20 text-white/60 hover:border-white/40",
  };

  const pulseStyle = pulse ? "animate-pulse" : "";

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${pulseStyle} ${className}`}
    >
      {children}
    </div>
  );
};

export default Badge;
