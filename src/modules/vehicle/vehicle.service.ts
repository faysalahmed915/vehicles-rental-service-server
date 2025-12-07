import { pool } from "../../config/db";

const createVehicle = async (payload: any) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

  const convertedType = type.toLowerCase();

  const query = `
    INSERT INTO vehicles 
    (vehicle_name, type, registration_number, daily_rent_price, availability_status)
    VALUES ($1, $2, $3, $4, COALESCE($5, 'available'))
    RETURNING *;
  `;

  return pool.query(query, [
    vehicle_name,
    convertedType,
    registration_number,
    daily_rent_price,
    availability_status
  ]);
};

const getAllVehicles = async () => {
  const query = `SELECT * FROM vehicles ORDER BY vehicle_id DESC`;
  return pool.query(query);
};

const getSingleVehicle = async (vehicle_id: string) => {
  console.log(vehicle_id);
  const query = `SELECT * FROM vehicles WHERE vehicle_id = $1`;
  return pool.query(query, [vehicle_id]);
};

const updateVehicle = async (vehicle_id: string, payload: any) => {
  let { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

  // convert type to lowercase if it exists
  if (type) {
    type = type.toLowerCase();
  }

  const query = `
    UPDATE vehicles
    SET vehicle_name = COALESCE($1, vehicle_name),
        type = COALESCE($2, type),
        registration_number = COALESCE($3, registration_number),
        daily_rent_price = COALESCE($4, daily_rent_price),
        availability_status = COALESCE($5, availability_status)
    WHERE vehicle_id = $6
    RETURNING *;
  `;

  return pool.query(query, [
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
    vehicle_id,
  ]);
};


const deleteVehicle = async (vehicle_id: string) => {
  const query = `DELETE FROM vehicles WHERE vehicle_id = $1`;
  return pool.query(query, [vehicle_id]);
};

export default {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
