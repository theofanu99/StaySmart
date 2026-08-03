import BookingChart from "../../components/bookingchart";
import StatCard from "../../components/statcard";
import { BedDouble, CalendarCheck, DollarSign, Sparkles } from "lucide-react";

type Stats = {
  totalBookings: number;
  totalRevenue: number;
  totalRooms: number;
};

type Analytics = {
  date: string;
  bookings: number;
};

type Prediction = {
  date: string;
  predicted: number;
  demand_level: string;
};

async function getStats(): Promise<Stats> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats`, {
    cache: "no-store",
  });

  return res.json();
}

async function getAnalytics(): Promise<Analytics[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics`, {
    cache: "no-store",
  });

  return res.json();
}

async function getPrediction(): Promise<Prediction[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prediction`, {
    cache: "no-store",
  });

  return res.json();
}

function getDemandStyle(level: string) {
  if (level === "High Demand") {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  if (level === "Medium") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  return "bg-emerald-50 text-emerald-700 border-emerald-200";
}

export default async function DashboardPage() {
  const stats = await getStats();
  const analytics = await getAnalytics();
  const prediction = await getPrediction();

  const latestAnalytics = analytics.slice(-30).map((item) => ({
    date: item.date.slice(5, 10),
    bookings: item.bookings,
  }));

  const predictionChart = prediction.map((item) => ({
    date: item.date.slice(5, 10),
    predicted: item.predicted,
  }));

  const chartData = [...latestAnalytics, ...predictionChart];

  const highDemandDates = prediction.filter(
    (item) => item.demand_level === "High Demand"
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Admin Dashboard
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            Booking analytics
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Monitor booking performance, revenue, and AI-based high demand
            prediction.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-sm text-slate-500">Prediction window</p>
          <p className="text-2xl font-bold text-slate-900">14 Days</p>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          description="All recorded hotel reservations"
          icon={CalendarCheck}
        />

        <StatCard
          title="Total Revenue"
          value={`Rp ${stats.totalRevenue.toLocaleString("id-ID")}`}
          description="Estimated revenue from bookings"
          icon={DollarSign}
        />

        <StatCard
          title="Room Types"
          value={stats.totalRooms}
          description="Available hotel room categories"
          icon={BedDouble}
        />
      </section>

      <section className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Booking Trend
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Actual booking data and predicted demand.
              </p>
            </div>
          </div>

          <BookingChart data={chartData} />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <Sparkles />
          </div>

          <p className="text-sm text-slate-400">AI Summary</p>
          <h2 className="mt-2 text-3xl font-bold">
            {highDemandDates.length} high demand dates detected
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            The prediction model uses historical bookings, weekend patterns, and
            seasonal adjustment to estimate future demand.
          </p>

          <div className="mt-6 space-y-3">
            {highDemandDates.slice(0, 3).map((item) => (
              <div
                key={item.date}
                className="rounded-2xl bg-white/10 p-4 text-sm"
              >
                <p className="font-semibold">{item.date}</p>
                <p className="text-slate-400">
                  Estimated {item.predicted} bookings
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Demand Prediction
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Predicted booking demand for the next 14 days.
          </p>

          <div className="mt-6 space-y-3">
            {prediction.map((item) => (
              <div
                key={item.date}
                className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"
              >
                <div>
                  <p className="font-semibold text-slate-900">{item.date}</p>
                  <p className="text-sm text-slate-500">
                    Predicted bookings: {item.predicted}
                  </p>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getDemandStyle(
                    item.demand_level
                  )}`}
                >
                  {item.demand_level}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            High Demand Dates
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Recommended dates for higher room preparation or dynamic pricing.
          </p>

          <div className="mt-6 space-y-4">
            {highDemandDates.length > 0 ? (
              highDemandDates.map((item) => (
                <div
                  key={item.date}
                  className="rounded-2xl border border-rose-100 bg-rose-50 p-5"
                >
                  <p className="font-bold text-rose-700">{item.date}</p>
                  <p className="mt-1 text-sm text-rose-600">
                    Estimated {item.predicted} bookings. Consider increasing
                    staff availability and room preparation.
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No high-demand dates detected.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}