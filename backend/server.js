const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "StaySmart API is running",
  });
});

// GET all rooms
app.get("/api/rooms", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rooms ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

// CREATE booking
app.post("/api/bookings", async (req, res) => {
  try {
    const {
      guest_name,
      guest_email,
      room_id,
      checkin_date,
      checkout_date,
      guests,
    } = req.body;

    if (
      !guest_name ||
      !guest_email ||
      !room_id ||
      !checkin_date ||
      !checkout_date ||
      !guests
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const availability = await checkRoomAvailability(
  Number(room_id),
  checkin_date,
  checkout_date
);

if (!availability.available) {
  return res.status(409).json({
    error: "Room is not available for selected dates",
    availability,
  });
}

    const result = await pool.query(
      `INSERT INTO bookings 
      (guest_name, guest_email, room_id, checkin_date, checkout_date, guests)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [guest_name, guest_email, room_id, checkin_date, checkout_date, guests]
    );

    res.status(201).json({
      message: "Booking created successfully",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create booking",
    });
  }
});

async function checkRoomAvailability(roomId, checkinDate, checkoutDate) {
  const roomResult = await pool.query(
    `
    SELECT total_units 
    FROM rooms 
    WHERE id = $1
    `,
    [roomId]
  );

  if (roomResult.rows.length === 0) {
    return {
      available: false,
      message: "Room not found",
    };
  }

  const totalUnits = roomResult.rows[0].total_units;

  const bookedResult = await pool.query(
    `
    SELECT COUNT(*)::int AS booked_count
    FROM bookings
    WHERE room_id = $1
      AND status != 'cancelled'
      AND checkin_date < $3
      AND checkout_date > $2
    `,
    [roomId, checkinDate, checkoutDate]
  );

  const bookedCount = bookedResult.rows[0].booked_count;
  const availableUnits = totalUnits - bookedCount;

  return {
    available: availableUnits > 0,
    total_units: totalUnits,
    booked_units: bookedCount,
    available_units: availableUnits,
  };
}

// GET latest bookings
app.get("/api/bookings", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        bookings.id,
        bookings.guest_name,
        bookings.guest_email,
        bookings.checkin_date,
        bookings.checkout_date,
        bookings.guests,
        rooms.name AS room_name,
        rooms.type AS room_type
      FROM bookings
      JOIN rooms ON bookings.room_id = rooms.id
      ORDER BY bookings.created_at DESC
      LIMIT 20
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch bookings",
    });
  }
});

// GET dashboard stats
app.get("/api/stats", async (req, res) => {
  try {
    const totalBookings = await pool.query(`
      SELECT COUNT(*) FROM bookings
    `);

    const totalRevenue = await pool.query(`
      SELECT COALESCE(SUM(rooms.price), 0) AS revenue
      FROM bookings
      JOIN rooms ON bookings.room_id = rooms.id
    `);

    const totalRooms = await pool.query(`
      SELECT COUNT(*) FROM rooms
    `);

    res.json({
      totalBookings: Number(totalBookings.rows[0].count),
      totalRevenue: Number(totalRevenue.rows[0].revenue),
      totalRooms: Number(totalRooms.rows[0].count),
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch stats",
    });
  }
});

// GET analytics booking per day
app.get("/api/analytics", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        checkin_date::date AS date,
        COUNT(*)::int AS bookings
      FROM bookings
      GROUP BY checkin_date
      ORDER BY checkin_date ASC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch analytics",
    });
  }
});

// GET prediction
app.get("/api/prediction", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        checkin_date::date AS date,
        COUNT(*)::int AS bookings
      FROM bookings
      GROUP BY checkin_date
      ORDER BY checkin_date ASC
    `);

    const data = result.rows;

    const last30 = data.slice(-30);
    const avg =
      last30.reduce((sum, item) => sum + item.bookings, 0) / last30.length;

    const predictions = [];

    const lastDate = new Date(data[data.length - 1].date);

    for (let i = 1; i <= 14; i++) {
      const futureDate = new Date(lastDate);
      futureDate.setDate(lastDate.getDate() + i);

      const day = futureDate.getDay();
      const isWeekend = day === 0 || day === 6;

      let predicted = Math.round(avg);

      if (isWeekend) {
        predicted += 8;
      }

      const month = futureDate.getMonth() + 1;
      if (month === 6 || month === 7 || month === 12) {
        predicted += 10;
      }

      predictions.push({
        date: futureDate.toISOString().split("T")[0],
        predicted,
        demand_level:
          predicted >= 25 ? "High Demand" : predicted >= 15 ? "Medium" : "Low",
      });
    }

    res.json(predictions);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to generate prediction",
    });
  }
});

app.get("/api/admin/bookings", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        bookings.id,
        bookings.guest_name,
        bookings.guest_email,
        bookings.checkin_date,
        bookings.checkout_date,
        bookings.guests,
        bookings.status,
        bookings.created_at,
        rooms.name AS room_name,
        rooms.type AS room_type,
        rooms.price AS room_price
      FROM bookings
      JOIN rooms ON bookings.room_id = rooms.id
      ORDER BY bookings.created_at DESC
      LIMIT 50
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch admin bookings",
    });
  }
});

app.patch("/api/admin/bookings/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["pending", "confirmed", "cancelled"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        error: "Invalid booking status",
      });
    }

    const result = await pool.query(
      `
      UPDATE bookings
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Booking not found",
      });
    }

    res.json({
      message: "Booking status updated successfully",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to update booking status",
    });
  }
});

// dynamic pricing endpoint
app.get("/api/dynamic-pricing", async (req, res) => {
  try {
    const roomsResult = await pool.query(`
      SELECT * FROM rooms ORDER BY id ASC
    `);

    const analyticsResult = await pool.query(`
      SELECT 
        checkin_date::date AS date,
        COUNT(*)::int AS bookings
      FROM bookings
      GROUP BY checkin_date
      ORDER BY checkin_date ASC
    `);

    const rooms = roomsResult.rows;
    const data = analyticsResult.rows;

    if (data.length === 0) {
      return res.json(
        rooms.map((room) => ({
          ...room,
          demand_level: "Low",
          multiplier: 1,
          dynamic_price: room.price,
        }))
      );
    }

    const last30 = data.slice(-30);
    const avg =
      last30.reduce((sum, item) => sum + item.bookings, 0) / last30.length;

    const today = new Date();
    const day = today.getDay();
    const isWeekend = day === 0 || day === 6;

    let predicted = Math.round(avg);

    if (isWeekend) {
      predicted += 8;
    }

    const month = today.getMonth() + 1;
    if (month === 6 || month === 7 || month === 12) {
      predicted += 10;
    }

    let demandLevel = "Low";
    let multiplier = 1;

    if (predicted >= 25) {
      demandLevel = "High Demand";
      multiplier = 1.25;
    } else if (predicted >= 15) {
      demandLevel = "Medium";
      multiplier = 1.1;
    }

    const pricing = rooms.map((room) => ({
      ...room,
      predicted_bookings: predicted,
      demand_level: demandLevel,
      multiplier,
      dynamic_price: Math.round(room.price * multiplier),
      increase_percentage: Math.round((multiplier - 1) * 100),
    }));

    res.json(pricing);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to calculate dynamic pricing",
    });
  }
});

app.get("/api/availability", async (req, res) => {
  try {
    const { room_id, checkin_date, checkout_date } = req.query;

    if (!room_id || !checkin_date || !checkout_date) {
      return res.status(400).json({
        error: "room_id, checkin_date, and checkout_date are required",
      });
    }

    const availability = await checkRoomAvailability(
      Number(room_id),
      checkin_date,
      checkout_date
    );

    res.json(availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to check room availability",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});