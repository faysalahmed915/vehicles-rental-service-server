import {pool} from "../../config/db";

const createVehicle = async (payload: any) => {
  const { vehicle_name, type, registration_number, daily_rent_price } = payload;

  const query = `
    INSERT INTO vehicles 
    (vehicle_name, type, registration_number, daily_rent_price, availability_status)
    VALUES ($1, $2, $3, $4, 'available')
    RETURNING *;
  `;

  return pool.query(query, [
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
  ]);
};

const getAllVehicles = async () => {
  const query = `SELECT * FROM vehicles ORDER BY id DESC`;
  return pool.query(query);
};

const getSingleVehicle = async (id: string) => {
  const query = `SELECT * FROM vehicles WHERE id = $1`;
  return pool.query(query, [id]);
};

const updateVehicle = async (id: string, payload: any) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

  const query = `
    UPDATE vehicles
    SET vehicle_name=$1,
        type=$2,
        registration_number=$3,
        daily_rent_price=$4,
        availability_status=$5
    WHERE id=$6
    RETURNING *;
  `;

  return pool.query(query, [
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
    id,
  ]);
};

const deleteVehicle = async (id: string) => {
  const query = `DELETE FROM vehicles WHERE id = $1`;
  return pool.query(query, [id]);
};

export default {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
