export type BookingStatus = "active" | "cancelled" | "returned";

export interface Booking {
  id: number;
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string; // YYYY-MM-DD
  rent_end_date: string;
  total_price: number;
  status: BookingStatus;
  created_at?: string;
  updated_at?: string;
  vehicle?: {
    vehicle_name: string;
    registration_number: string;
    type?: string;
    daily_rent_price?: number;
    availability_status?: string;
  };
  customer?: {
    name: string;
    email: string;
  };
}

export interface CreateBookingDTO {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}

export interface UpdateBookingDTO {
  status: BookingStatus;
}

export interface UserPayload {
  id: number;
  role: "admin" | "customer";
}
