'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: 'Jan', revenue: 18600000 },
  { month: 'Fév', revenue: 30500000 },
  { month: 'Mar', revenue: 23700000 },
  { month: 'Avr', revenue: 17300000 },
  { month: 'Mai', revenue: 20900000 },
  { month: 'Jui', revenue: 21400000 },
  { month: 'Jul', revenue: 28400000 },
  { month: 'Aoû', revenue: 25100000 },
  { month: 'Sep', revenue: 31200000 },
  { month: 'Oct', revenue: 24500000 },
  { month: 'Nov', revenue: 29800000 },
  { month: 'Déc', revenue: 34900000 },
];

const chartConfig = {
  revenue: {
    label: "Chiffre d'affaires",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function RevenueChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <XAxis
            dataKey="month"
            stroke="hsl(var(--foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${(value as number) / 1000000}M`}
          />
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent 
              formatter={(value) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(value as number)}
              indicator="dot"
            />}
          />
          <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
