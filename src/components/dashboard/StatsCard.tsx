import { ReactNode } from "react";
import Card from "@/components/ui/Card";

interface StatsCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
}

export default function StatsCard({
  icon,
  title,
  value,
  subtitle,
}: StatsCardProps) {
  return (
    <Card className="text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-3xl font-bold gradient-text mb-1">{value}</h3>
      <p className="text-sm font-medium text-foreground mb-1">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </Card>
  );
}
