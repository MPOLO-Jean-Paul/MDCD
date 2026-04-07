'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { service: 'Consultations', revenue: 45000000 },
  { service: 'Laboratoire', revenue: 28000000 },
  { service: 'Imagerie', revenue: 21000000 },
  { service: 'Hospitalisation', revenue: 35500000 },
  { service: 'Pharmacie', revenue: 18000000 },
  { service: 'Actes Chirurg.', revenue: 12500000 },
];

const chartConfig = {
  revenue: {
    label: "Chiffre d'affaires",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function RevenueByServiceChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
          <XAxis
            type="number"
            stroke="hsl(var(--foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${(value as number) / 1000000}M`}
          />
          <YAxis
            type="category"
            dataKey="service"
            stroke="hsl(var(--foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={80}
          />
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent 
              formatter={(value) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(value as number)}
              indicator="dot"
            />}
          />
          <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
