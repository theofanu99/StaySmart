"use client";

import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type ChartData = {
  date: string;
  bookings?: number;
  predicted?: number;
};

export default function BookingChart({ data }: { data: ChartData[] }) {
  return (
    <div className="h-[380px] w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0f172a" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
            </linearGradient>

            <linearGradient id="predictGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
            }}
          />

          <Area
            type="monotone"
            dataKey="bookings"
            stroke="#0f172a"
            strokeWidth={3}
            fill="url(#actualGradient)"
          />

          <Area
            type="monotone"
            dataKey="predicted"
            stroke="#6366f1"
            strokeWidth={3}
            fill="url(#predictGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}