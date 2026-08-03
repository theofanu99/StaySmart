"use client";

import { useEffect, useState } from "react";
import {
  BedDouble,
  CalendarDays,
  CheckCircle2,
  Mail,
  User,
  Users,
  XCircle,
} from "lucide-react";

type Room = {
  id: number;
  name: string;
  type: string;
  price: number;
  capacity: number;
  image_url: string;
  total_units: number;
};

type Availability = {
  available: boolean;
  total_units: number;
  booked_units: number;
  available_units: number;
};

export default function BookingPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    guest_name: "",
    guest_email: "",
    room_id: "",
    checkin_date: "",
    checkout_date: "",
    guests: 1,
  });

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch(`${API_URL}/api/rooms`);
        const data = await res.json();
        setRooms(data);
      } catch (error) {
        console.error(error);
        alert("Failed to fetch rooms");
      }
    }

    fetchRooms();
  }, [API_URL]);

  async function checkAvailability(updatedForm = form) {
    if (
      !updatedForm.room_id ||
      !updatedForm.checkin_date ||
      !updatedForm.checkout_date
    ) {
      setAvailability(null);
      return;
    }

    setChecking(true);

    try {
      const params = new URLSearchParams({
        room_id: updatedForm.room_id,
        checkin_date: updatedForm.checkin_date,
        checkout_date: updatedForm.checkout_date,
      });

      const res = await fetch(`${API_URL}/api/availability?${params}`);
      const data = await res.json();

      if (!res.ok) {
        setAvailability(null);
        return;
      }

      setAvailability(data);
    } catch (error) {
      console.error(error);
      setAvailability(null);
    } finally {
      setChecking(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!availability?.available) {
      alert("Room is not available for selected dates");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          room_id: Number(form.room_id),
          guests: Number(form.guests),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Booking failed");
        return;
      }

      alert("Booking created successfully");

      setForm({
        guest_name: "",
        guest_email: "",
        room_id: "",
        checkin_date: "",
        checkout_date: "",
        guests: 1,
      });

      setSelectedRoom(null);
      setAvailability(null);
    } catch (error) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  }

  function updateForm(field: string, value: string | number) {
    const updatedForm = {
      ...form,
      [field]: value,
    };

    setForm(updatedForm);
    checkAvailability(updatedForm);
  }

  function handleRoomSelect(room: Room) {
    setSelectedRoom(room.id);

    const updatedForm = {
      ...form,
      room_id: String(room.id),
    };

    setForm(updatedForm);
    checkAvailability(updatedForm);
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Reservation
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            Book your room
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Choose a room, select your stay date, and check availability before
            confirming the booking.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-sm text-slate-500">Available room types</p>
          <p className="text-2xl font-bold text-slate-900">{rooms.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {rooms.map((room) => (
            <button
              type="button"
              key={room.id}
              onClick={() => handleRoomSelect(room)}
              className={`overflow-hidden rounded-3xl border bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                selectedRoom === room.id
                  ? "border-slate-900 ring-2 ring-slate-900"
                  : "border-slate-200"
              }`}
            >
              
            <div className="relative h-44 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-600">
            {room.image_url ? (
              <img
                src={room.image_url}
                alt={room.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-start p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <BedDouble className="text-white" />
                </div>
              </div>
            )}
          </div>

              <div className="p-5">
                <h2 className="text-xl font-bold text-slate-900">
                  {room.name}
                </h2>
                <p className="mt-1 text-sm capitalize text-slate-500">
                  {room.type} room • {room.capacity} guests
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Total units: {room.total_units}
                </p>

                <p className="mt-5 text-lg font-bold text-slate-900">
                  Rp {room.price.toLocaleString("id-ID")}
                  <span className="text-sm font-normal text-slate-500">
                    {" "}
                    / night
                  </span>
                </p>
              </div>
            </button>
          ))}
        </section>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-slate-900">Guest Details</h2>
          <p className="mt-2 text-sm text-slate-500">
            Complete your reservation information.
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Guest name
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:ring-2 focus-within:ring-slate-900">
                <User size={18} className="text-slate-400" />
                <input
                  type="text"
                  value={form.guest_name}
                  onChange={(e) => updateForm("guest_name", e.target.value)}
                  placeholder="Theofanu Rinaldo"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:ring-2 focus-within:ring-slate-900">
                <Mail size={18} className="text-slate-400" />
                <input
                  type="email"
                  value={form.guest_email}
                  onChange={(e) => updateForm("guest_email", e.target.value)}
                  placeholder="guest@mail.com"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Check-in
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:ring-2 focus-within:ring-slate-900">
                  <CalendarDays size={18} className="text-slate-400" />
                  <input
                    type="date"
                    value={form.checkin_date}
                    onChange={(e) => updateForm("checkin_date", e.target.value)}
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Check-out
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:ring-2 focus-within:ring-slate-900">
                  <CalendarDays size={18} className="text-slate-400" />
                  <input
                    type="date"
                    value={form.checkout_date}
                    onChange={(e) =>
                      updateForm("checkout_date", e.target.value)
                    }
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Guests
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:ring-2 focus-within:ring-slate-900">
                <Users size={18} className="text-slate-400" />
                <input
                  type="number"
                  min="1"
                  value={form.guests}
                  onChange={(e) => updateForm("guests", Number(e.target.value))}
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              {checking ? (
                <p className="text-sm font-medium text-slate-500">
                  Checking availability...
                </p>
              ) : availability ? (
                availability.available ? (
                  <div className="flex items-start gap-3 text-emerald-700">
                    <CheckCircle2 size={20} />
                    <div>
                      <p className="font-semibold">Room available</p>
                      <p className="text-sm">
                        {availability.available_units} of{" "}
                        {availability.total_units} units available.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 text-rose-700">
                    <XCircle size={20} />
                    <div>
                      <p className="font-semibold">Room not available</p>
                      <p className="text-sm">
                        All {availability.total_units} units are booked for this
                        date range.
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <p className="text-sm text-slate-500">
                  Select a room, check-in date, and check-out date to check
                  availability.
                </p>
              )}
            </div>

            <button
              disabled={loading || !availability?.available}
              className="w-full rounded-2xl bg-slate-900 px-5 py-4 font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}