DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS rooms;

CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  price INT NOT NULL,
  capacity INT NOT NULL,
  image_url TEXT
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  guest_name VARCHAR(100) NOT NULL,
  guest_email VARCHAR(100) NOT NULL,
  room_id INT REFERENCES rooms(id),
  checkin_date DATE NOT NULL,
  checkout_date DATE NOT NULL,
  guests INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO rooms (name, type, price, capacity, image_url) VALUES
('Standard Room', 'standard', 450000, 2, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),
('Deluxe Room', 'deluxe', 750000, 3, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32'),
('Suite Room', 'suite', 1200000, 4, 'https://images.unsplash.com/photo-1590490360182-c33d57733427');