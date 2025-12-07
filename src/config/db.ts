import { Pool } from "pg";
import config from "."


export const pool = new Pool({
    connectionString: `${config.database_url}`,

});


const initDB = async () => {
    // users table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password TEXT NOT NULL CHECK (LENGTH(password) >= 6),
            phone VARCHAR(20) NOT NULL,
            role VARCHAR(20) CHECK (role IN ('admin', 'customer')),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
    `);


        
    // vehicles
    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles (
            vehicle_id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(100) NOT NULL,
            type VARCHAR(50) CHECK (type IN ('car', 'bike', 'van', 'suv')) NOT NULL,
            registration_number VARCHAR(50) UNIQUE NOT NULL,
            daily_rent_price INT NOT NULL CHECK (daily_rent_price > 0),
            availability_status VARCHAR(20) CHECK (availability_status IN ('available', 'booked')) DEFAULT 'available'
        );
    `);


    // bookings
    await pool.query(`
       CREATE TABLE IF NOT EXISTS bookings (
            booking_id SERIAL PRIMARY KEY,
            customer_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
            vehicle_id INT NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE RESTRICT,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL,
            total_price NUMERIC(10, 2) NOT NULL,
            status VARCHAR(20) CHECK (status IN ('active', 'cancelled', 'returned')) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            CHECK (rent_end_date >= rent_start_date)
        );
    `);
};

export default initDB;
