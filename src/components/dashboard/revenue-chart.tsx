'use client';

import { useState, useEffect } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { HospitalDataService } from '@/lib/firestore-service';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  revenue: {
    label: "Chiffre d'affaires",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function RevenueChart() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const stats = await HospitalDataService.getGlobalAnalytics();
        // If no data yet, show some zeros or base trend
        if (stats.revenueByMonth.every((m: any) => m.revenue === 0)) {
           // Provide some visual feedback if empty
           setData(stats.revenueByMonth);
        } else {
           setData(stats.revenueByMonth);
        }
      } catch (e) {
        console.error("Chart data loading failed:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[300px] w-full flex flex-col gap-2">
        <Skeleton className="h-full w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            stroke="hsl(var(--muted-foreground))"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => val}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${(value as number) / 1000}k`}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--primary)/0.05)', radius: 8 }}
            content={<ChartTooltipContent 
              formatter={(value) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(value as number)}
              indicator="line"
            />}
          />
          <Bar 
            dataKey="revenue" 
            fill="url(#barGradient)" 
            radius={[6, 6, 0, 0]} 
            barSize={20}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.revenue === 0 ? 'hsl(var(--muted)/0.3)' : 'url(#barGradient)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
