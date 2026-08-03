import {
  BedDouble,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  BadgePercent,
} from "lucide-react";

type PricingRoom = {
  id: number;
  name: string;
  type: string;
  price: number;
  capacity: number;
  predicted_bookings: number;
  demand_level: string;
  multiplier: number;
  dynamic_price: number;
  increase_percentage: number;
};

async function getDynamicPricing(): Promise<PricingRoom[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/dynamic-pricing`,
    {
      cache: "no-store",
    }
  );

  return res.json();
}

function getDemandStyle(level: string) {
  if (level === "High Demand") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (level === "Medium") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

export default async function PricingPage() {
  const rooms = await getDynamicPricing();

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-600">
            AI Pricing
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            Dynamic Room Pricing
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Room prices are adjusted automatically based on predicted booking
            demand, weekend trends, and seasonal patterns.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-sm text-slate-500">Pricing model</p>
          <p className="text-2xl font-bold text-slate-900">AI Based</p>
        </div>
      </div>

      <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <BadgePercent />
          </div>
          <p className="text-sm text-slate-500">Low Demand</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-950">
            Normal Price
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Applied when predicted bookings are low.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <TrendingUp />
          </div>
          <p className="text-sm text-slate-500">Medium Demand</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-950">+10%</h3>
          <p className="mt-2 text-sm text-slate-500">
            Applied when demand starts increasing.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <Sparkles />
          </div>
          <p className="text-sm text-slate-500">High Demand</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-950">+25%</h3>
          <p className="mt-2 text-sm text-slate-500">
            Applied during predicted peak booking periods.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-950">
              <BedDouble />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  {room.name}
                </h2>
                <p className="mt-1 text-sm capitalize text-slate-500">
                  {room.type} room • {room.capacity} guests
                </p>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getDemandStyle(
                  room.demand_level
                )}`}
              >
                {room.demand_level}
              </span>
            </div>

            <div className="mt-8 rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Base price</p>
              <p className="mt-1 text-xl font-bold text-slate-500 line-through">
                Rp {room.price.toLocaleString("id-ID")}
              </p>

              <p className="mt-5 text-sm text-slate-500">Dynamic price</p>
              <p className="mt-1 text-3xl font-bold text-slate-950">
                Rp {room.dynamic_price.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Predicted bookings</span>
                <span className="font-semibold text-slate-950">
                  {room.predicted_bookings}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Price adjustment</span>
                <span className="inline-flex items-center gap-1 font-semibold text-slate-950">
                  +{room.increase_percentage}%
                  <ArrowUpRight size={15} />
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Multiplier</span>
                <span className="font-semibold text-slate-950">
                  x{room.multiplier}
                </span>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}