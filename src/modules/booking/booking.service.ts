import { pool } from "../../db";
import { Booking } from "./booking.types";

// create booking
export const createBooking = async (data: {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = data;

  // get vehicle daily price
  const vehicleRes = await pool.query("SELECT daily_rent_price FROM vehicles WHERE id=$1", [vehicle_id]);
  if (!vehicleRes.rows.length) throw new Error("Vehicle not found");

  const dailyPrice = vehicleRes.rows[0].daily_rent_price;
  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);
  const dayCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const total_price = dailyPrice * dayCount;

  // insert booking
  const result = await pool.query(
    `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price) 
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  // mark vehicle as booked
  await pool.query("UPDATE vehicles SET availability_status='booked' WHERE id=$1", [vehicle_id]);

  return result.rows[0];
};

// get bookings (role-based)
export const getBookings = async (user: { id: number; role: string }) => {
  let query = `
    SELECT b.*, 
           u.name AS customer_name, u.email AS customer_email,
           v.vehicle_name, v.registration_number, v.type
    FROM bookings b
    JOIN users u ON b.customer_id=u.id
    JOIN vehicles v ON b.vehicle_id=v.id
  `;

  const params: any[] = [];
  if (user.role === "customer") {
    query += " WHERE b.customer_id=$1";
    params.push(user.id);
  }

  const res = await pool.query(query, params);

  return res.rows.map(row => ({
    id: row.id,
    customer_id: row.customer_id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: row.total_price,
    status: row.status,
    customer: user.role === "admin" ? { name: row.customer_name, email: row.customer_email } : undefined,
    vehicle: { vehicle_name: row.vehicle_name, registration_number: row.registration_number, type: row.type }
  }));
};
