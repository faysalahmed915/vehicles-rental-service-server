import { Request, Response } from "express";
import * as bookingService from "./booking.service";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json({ success: true, message: "Booking created successfully", data: booking });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await bookingService.getBookings(req.user);
    const msg = req.user.role === "admin" ? "Bookings retrieved successfully" : "Your bookings retrieved successfully";
    res.status(200).json({ success: true, message: msg, data: bookings });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
