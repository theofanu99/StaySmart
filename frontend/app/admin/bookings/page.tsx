"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Mail,
  Users,
  XCircle,
} from "lucide-react";

type Booking = {
  id: number;
  guest_name: string;
  guest_email: string;
  checkin_date: string;
  checkout_date: string;
  guests: number;
  status: "pending" | "confirmed" | "cancelled";
  room_name: string;
  room_type: string;
  room_price: number;
  created_at: string;
};

function getStatusStyle(status: string) {
  if (status === "confirmed") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "cancelled") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

function getStatusIcon(status: string) {
  if (status === "confirmed") return <CheckCircle2 size={16} />;
  if (status === "cancelled") return <XCircle size={16} />;
  return <Clock size={16} />;
}

export default function AdminBookingsPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchBookings() {
    try {
      const res = await fetch(`${API_URL}/api/admin/bookings`);
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: Booking["status"]) {
    try {
      const res = await fetch(`${API_URL}/api/admin/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update status");
        return;
      }

      fetchBookings();
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Admin Panel
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            Booking Management
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Review guest reservations and update booking status.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-sm text-slate-500">Total records</p>
          <p className="text-2xl font-bold text-slate-900">
            {bookings.length}
          </p>
        </div>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-950">
            Recent Bookings
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Latest 50 booking records from the system.
          </p>
        </div>

        {loading ? (
          <div className="p-6 text-slate-500">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="p-6 text-slate-500">No bookings found.</div>
        ) : (
          <div className="divide-y divide-slate-200">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="grid grid-cols-1 gap-5 p-6 transition hover:bg-slate-50 lg:grid-cols-[1fr_1fr_auto]"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-950">
                      {booking.guest_name}
                    </h3>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <Mail size={16} />
                    {booking.guest_email}
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <Users size={16} />
                    {booking.guests} guests
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    {booking.room_name}
                  </p>

                  <p className="mt-1 text-sm capitalize text-slate-500">
                    {booking.room_type} room • Rp{" "}
                    {booking.room_price.toLocaleString("id-ID")} / night
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <CalendarDays size={16} />
                    {booking.checkin_date.slice(0, 10)} →{" "}
                    {booking.checkout_date.slice(0, 10)}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  <button
                    onClick={() => updateStatus(booking.id, "confirmed")}
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() => updateStatus(booking.id, "pending")}
                    className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100"
                  >
                    Pending
                  </button>

                  <button
                    onClick={() => updateStatus(booking.id, "cancelled")}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}