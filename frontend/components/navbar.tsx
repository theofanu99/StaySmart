import Link from "next/link";
import { Hotel } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
            <Hotel size={19} />
          </div>

          <span className="text-xl font-bold tracking-tight text-slate-950">
            StaySmart
          </span>
        </Link>

        <div className="hidden rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm md:flex">
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          >
            Home
          </Link>

          <Link
            href="/booking"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          >
            Booking
          </Link>

          <Link
            href="/dashboard"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          >
            Dashboard
          </Link>
        </div>

        <Link
  href="/pricing"
  className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
>
  Pricing
</Link>

        <Link
          href="/booking"
          className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          Book Now
        </Link>
      </div>
    </nav>
  );
}