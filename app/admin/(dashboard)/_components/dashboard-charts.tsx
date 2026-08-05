"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatGHS } from "@/lib/utils"
import type { DashboardStats } from "@/lib/api/admins"

/**
 * Both charts plot a single series, so neither carries a legend — the card
 * heading names what's plotted. Marks use --chart-1, which sits inside the
 * light/dark lightness bands (validated) rather than the near-black brand green.
 */
const revenueConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

const ordersConfig = {
  orders: { label: "Orders", color: "var(--chart-1)" },
} satisfies ChartConfig

const AXIS_TICK = { fontSize: 11 } as const

function ChartCard({
  title,
  caption,
  loading,
  children,
}: {
  title: string
  caption: string
  loading: boolean
  children: React.ReactNode
}) {
  return (
    <Card className="bg-white ring-1 ring-foreground/4 dark:bg-card">
      <CardContent>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-semibold">{title}</h2>
          <span className="text-xs text-muted-foreground">{caption}</span>
        </div>
        {loading ? <Skeleton className="mt-6 h-52 w-full" /> : children}
      </CardContent>
    </Card>
  )
}

export function RevenueChart({
  data,
  loading,
}: {
  data: DashboardStats["revenueByMonth"] | undefined
  loading: boolean
}) {
  return (
    <ChartCard title="Revenue" caption="Last 6 months" loading={loading || !data}>
      <ChartContainer config={revenueConfig} className="mt-4 h-52 w-full">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            {/* area fill is a ~10% wash of the series hue, never a saturated block */}
            <linearGradient id="revenueWash" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.18} />
              <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeWidth={1} />
          <XAxis
            dataKey="label"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            width={56}
            tickFormatter={(v: number) => `GH₵${v.toLocaleString()}`}
          />
          <ChartTooltip
            cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
            content={
              <ChartTooltipContent
                formatter={(value) => formatGHS(Number(value))}
                indicator="line"
              />
            }
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-revenue)"
            strokeWidth={2}
            fill="url(#revenueWash)"
            dot={false}
            // ≥8px marker with a 2px surface ring so it stays legible on the line
            activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  )
}

export function OrdersChart({
  data,
  loading,
}: {
  data: DashboardStats["ordersByMonth"] | undefined
  loading: boolean
}) {
  return (
    <ChartCard title="Orders" caption="Last 6 months" loading={loading || !data}>
      <ChartContainer config={ordersConfig} className="mt-4 h-52 w-full">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeWidth={1} />
          <XAxis
            dataKey="label"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={40} allowDecimals={false} />
          <ChartTooltip
            cursor={{ fill: "var(--muted)" }}
            content={<ChartTooltipContent formatter={(value) => `${value} orders`} />}
          />
          {/* capped thickness so the band keeps its air; 4px rounded cap, square at baseline */}
          <Bar
            dataKey="orders"
            fill="var(--color-orders)"
            radius={[4, 4, 0, 0]}
            maxBarSize={24}
          />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}
