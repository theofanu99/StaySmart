import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  Sparkles,
  TrendingUp,
  BedDouble,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <section className="relative">
        <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-14 lg:grid-cols-2 lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
              <Sparkles size={16} className="text-indigo-600" />
              AI-powered hotel booking platform
            </div>

            <h1 className="text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-slate-950 md:text-6xl xl:text-7xl">
              Smarter hotel booking with AI demand prediction.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Manage room reservations, monitor booking trends, and predict
              high-demand dates from one clean dashboard.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-slate-900/15 transition hover:-translate-y-1 hover:bg-slate-800"
              >
                Start Booking
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-950 shadow-sm transition hover:-translate-y-1 hover:bg-slate-50"
              >
                View Dashboard
              </Link>
            </div>

            <div className="mt-12 grid max-w-xl grid-cols-3 gap-4">
              {[
                ["14d", "Prediction"],
                ["AI", "Forecast"],
                ["Live", "Analytics"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur"
                >
                  <p className="text-2xl font-bold text-slate-950">{value}</p>
                  <p className="mt-1 text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-10 hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/10 lg:block">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <TrendingUp size={22} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Booking Growth</p>
                  <p className="text-xl font-bold text-slate-950">+24.8%</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur">
              <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
                <div className="mb-7 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Demand Forecast</p>
                    <h2 className="mt-1 text-3xl font-bold">High Season</h2>
                  </div>

                  <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                    Next 14 Days
                  </div>
                </div>

                <div className="mb-8 grid h-40 grid-cols-7 items-end gap-3 rounded-3xl bg-white/5 p-5">
                  {[38, 52, 45, 70, 61, 82, 74].map((height, index) => (
                    <div
                      key={index}
                      className="rounded-full bg-gradient-to-t from-indigo-500 to-sky-300"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>

                <div className="space-y-3">
                  {[
                    ["Dec 22", "42 bookings", "High"],
                    ["Dec 23", "39 bookings", "High"],
                    ["Dec 24", "35 bookings", "Medium"],
                  ].map(([date, bookings, level]) => (
                    <div
                      key={date}
                      className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-4"
                    >
                      <div>
                        <p className="font-semibold">{date}</p>
                        <p className="text-sm text-slate-400">{bookings}</p>
                      </div>

                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-950">
                        {level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -bottom-7 right-8 hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/10 md:block">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <BedDouble size={22} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Room Occupancy</p>
                  <p className="text-xl font-bold text-slate-950">86%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 pb-20 md:grid-cols-3">
        {[
          {
            icon: CalendarCheck,
            title: "Booking Management",
            desc: "Guests can select rooms, dates, and submit reservations with a simple booking flow.",
          },
          {
            icon: BarChart3,
            title: "Analytics Dashboard",
            desc: "Track total bookings, estimated revenue, and room demand trends in real-time.",
          },
          {
            icon: Sparkles,
            title: "AI Prediction",
            desc: "Predict future high-demand dates using historical booking and seasonal patterns.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="group rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur transition hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-900/10"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 transition group-hover:bg-slate-950 group-hover:text-white">
              <item.icon size={24} />
            </div>

            <h3 className="text-xl font-bold text-slate-950">{item.title}</h3>

            <p className="mt-3 leading-7 text-slate-600">{item.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}