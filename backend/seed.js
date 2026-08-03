const pool = require("./db");

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

async function seedBookings() {
  try {
    await pool.query("DELETE FROM bookings");

    const start = new Date("2025-01-01");
    const end = new Date("2025-12-31");

    const names = ["Theo", "Raka", "Dina", "Sarah", "Kevin", "Nabila"];
    const emails = ["guest1@mail.com", "guest2@mail.com", "guest3@mail.com"];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      let totalBookings = isWeekend(d) ? random(8, 20) : random(2, 10);

      // Simulasi high season
      const month = d.getMonth() + 1;
      if (month === 6 || month === 7 || month === 12) {
        totalBookings += random(8, 18);
      }

      for (let i = 0; i < totalBookings; i++) {
        const checkin = new Date(d);
        const checkout = new Date(d);
        checkout.setDate(checkout.getDate() + random(1, 3));

        await pool.query(
          `INSERT INTO bookings 
          (guest_name, guest_email, room_id, checkin_date, checkout_date, guests)
          VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            names[random(0, names.length - 1)],
            emails[random(0, emails.length - 1)],
            random(1, 3),
            formatDate(checkin),
            formatDate(checkout),
            random(1, 4),
          ]
        );
      }
    }

    console.log("Dummy booking data generated successfully.");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedBookings();