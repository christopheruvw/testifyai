import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  total: number;
  approved: number;
  pending: number;
  publicCount: number;
}

export function StatsCards({ total, approved, pending, publicCount }: StatsCardsProps) {
  const stats = [
    { label: "Total", value: total, accent: false },
    { label: "Approved", value: approved, accent: true },
    { label: "Pending", value: pending, accent: false },
    { label: "Public", value: publicCount, accent: false },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className={`relative overflow-hidden border border-[var(--border-color)] shadow-sm ${
            stat.accent ? "stat-card-accent" : ""
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="brand-label font-medium normal-case">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-[var(--text-primary)]">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
