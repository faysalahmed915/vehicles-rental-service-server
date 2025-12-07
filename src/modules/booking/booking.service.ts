// import { pool } from "../../db";
import { pool } from "../../config/db";
import { Booking, CreateBookingDTO, UpdateBookingDTO, UserPayload } from "./booking.types";

// Calculate total price
const calculateTotalPrice = async (vehicle_id: number, start: string, end: string) => {
    const { rows } = await pool.query(`SELECT daily_rent_price FROM vehicles WHERE id=$1`, [vehicle_id]);
    if (!rows[0]) throw new Error("Vehicle not found");
    const pricePerDay = rows[0].daily_rent_price;
    const days = Math.ceil(
        (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 3600 * 24)
    );
    return pricePerDay * days;
};

// Create booking
export const createBooking = async (payload: CreateBookingDTO): Promise<Booking> => {
    const total_price = await calculateTotalPrice(payload.vehicle_id, payload.rent_start_date, payload.rent_end_date) || 0;

      console.log(total_price);

    const status = "booked";

    const { rows } = await pool.query(
        `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
        [payload.customer_id, payload.vehicle_id, payload.rent_start_date, payload.rent_end_date, total_price, status]
    );


    console.log("{rows}", rows);

    // Update vehicle availability
    await pool.query(`UPDATE vehicles SET availability_status='booked' WHERE id=$1`, [payload.vehicle_id]);

    return rows[0];
};

// Get bookings
export const getBookings = async (user: UserPayload): Promise<Booking[]> => {
    if (user.role === "admin") {
        const { rows } = await pool.query(`
      SELECT b.*, 
             v.vehicle_name, v.registration_number, v.type, v.daily_rent_price, v.availability_status,
             u.name AS customer_name, u.email AS customer_email
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id=v.id
      JOIN users u ON b.customer_id=u.id
      ORDER BY b.id DESC
    `);

        return rows.map(row => ({
            ...row,
            vehicle: {
                vehicle_name: row.vehicle_name,
                registration_number: row.registration_number,
                type: row.type,
                daily_rent_price: row.daily_rent_price,
                availability_status: row.availability_status
            },
            customer: {
                name: row.customer_name,
                email: row.customer_email
            }
        }));
    } else {
        // customer sees only own bookings
        const { rows } = await pool.query(`
      SELECT b.*, 
             v.vehicle_name, v.registration_number, v.type
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id=v.id
      WHERE b.customer_id=$1
      ORDER BY b.id DESC
    `, [user.id]);

        return rows.map(row => ({
            ...row,
            vehicle: {
                vehicle_name: row.vehicle_name,
                registration_number: row.registration_number,
                type: row.type
            }
        }));
    }
};

// Update booking status
export const updateBookingStatus = async (bookingId: number, payload: UpdateBookingDTO): Promise<Booking> => {
    const { rows } = await pool.query(
        `UPDATE bookings SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
        [payload.status, bookingId]
    );

    if (!rows[0]) throw new Error("Booking not found");

    // Update vehicle availability if returned or cancelled
    if (["returned", "cancelled"].includes(payload.status)) {
        await pool.query(
            `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
            [rows[0].vehicle_id]
        );
    }

    return rows[0];
};
