"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const data = [
  { month: "Jan", bookings: 2, spending: 1200 },
  { month: "Feb", bookings: 1, spending: 900 },
  { month: "Mar", bookings: 0, spending: 0 },
  { month: "Apr", bookings: 3, spending: 2100 },
  { month: "May", bookings: 2, spending: 1500 },
  { month: "Jun", bookings: 1, spending: 800 },
  { month: "Jul", bookings: 4, spending: 3200 },
  { month: "Aug", bookings: 2, spending: 1700 },
  { month: "Sep", bookings: 1, spending: 950 },
  { month: "Oct", bookings: 0, spending: 0 },
  { month: "Nov", bookings: 1, spending: 1100 },
  { month: "Dec", bookings: 3, spending: 2800 },
]

export function DashboardChart() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center bg-[hsl(var(--muted)/0.2)] rounded-lg animate-pulse">
        <span className="sr-only">Loading chart...</span>
      </div>
    )
  }

  return (
    <Card className="dashboard-card w-full">
      <CardContent>
        <ChartContainer
          config={{
            bookings: {
              label: "Bookings",
              color: "hsl(var(--chart-1))",
            },
            spending: {
              label: "Spending ($)",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                opacity={0.3}
                stroke={theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
              />
              <XAxis dataKey="month" stroke={theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"} />
              <YAxis yAxisId="left" stroke={theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"} />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke={theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="bookings"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                dot={{ r: 4, strokeWidth: 2, fill: theme === "dark" ? "#111" : "#fff" }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="spending"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: theme === "dark" ? "#111" : "#fff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

