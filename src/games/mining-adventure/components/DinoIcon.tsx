import React from "react";
import { DinosaurType } from "../types";

interface DinoIconProps {
  type: DinosaurType;
  className?: string;
  color?: string;
}

const DinoIcon: React.FC<DinoIconProps> = ({
  type,
  className = "w-12 h-12",
  color = "currentColor",
}) => {
  // Simple stylized dinosaur SVGs
  switch (type) {
    case "raptor":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M18 10l-4-2-4 2-4-2-2 4 4 2 4-2 4 2 2-4z" />
          <path d="M12 18l-2-2-2 2-2-2 2-2 2 2 2-2 2 2" />
          <circle cx="15" cy="7" r="1" fill={color} />
        </svg>
      );
    case "triceratops":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M4 18h16l-2-8h-12l-2 8z" />
          <path d="M7 10l-1-4h2l1 4" />
          <path d="M12 10l0-5" />
          <path d="M17 10l1-4h-2l-1 4" />
          <circle cx="9" cy="14" r="1" fill={color} />
          <circle cx="15" cy="14" r="1" fill={color} />
        </svg>
      );
    case "pterodactyl":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M2 12c4-2 8-2 10 0s6 2 10 0" />
          <path d="M12 12v6m0-6l-4-4m4 4l4-4" />
          <circle cx="12" cy="10" r="1" fill={color} />
        </svg>
      );
    case "t-rex":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M4 22V10l4-4h8l4 4v4l-4 4h-4v4" />
          <path d="M18 10l-2 2M8 10l2 2" />
          <path d="M12 18h4M4 12h2" />
          <circle cx="14" cy="8" r="1" fill={color} />
        </svg>
      );
    case "spinosaurus":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M2 18h20L18 6H6L2 18z" />
          <path d="M12 6v-4h4" />
          <path d="M8 12h8" />
          <circle cx="9" cy="9" r="1" fill={color} />
        </svg>
      );
    case "brachiosaurus":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M6 22H18V12L12 4L6 12V22z" />
          <path d="M12 12l2 2" />
          <circle cx="12" cy="7" r="1" fill={color} />
        </svg>
      );
    default:
      return null;
  }
};

export default DinoIcon;
