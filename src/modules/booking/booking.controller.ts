import { Request, Response } from "express";
import * as bookingService from "./booking.service";
import { UserPayload, CreateBookingDTO, UpdateBookingDTO } from "./booking.types";

export const createBooking = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = req.user as UserPayload;

        const payload: CreateBookingDTO = { 
            ...req.body, 
            customer_id: user.id,
            status: "active" 
        };

        const booking = await bookingService.createBooking(payload);

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking
        });

    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};


export const getBookings = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
        const user = req.user as UserPayload;

        const bookings = await bookingService.getBookings(user);
        const msg = user.role === "admin" ? "Bookings retrieved successfully" : "Your bookings retrieved successfully";

        res.status(200).json({ success: true, message: msg, data: bookings });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateBooking = async (req: Request, res: Response) => {
    try {
        const bookingId = parseInt(req.params.bookingId as string, 10);
        const payload: UpdateBookingDTO = req.body;
        const updatedBooking = await bookingService.updateBookingStatus(bookingId, payload);
        res.status(200).json({ success: true, message: "Booking updated successfully", data: updatedBooking });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};




export const getSingleBooking = async (req: Request, res: Response) => {
    try {
        const user = req.user!;
        const userId = (user as UserPayload)?.id;
        const booking_id = parseInt(req.params.booking_id);

        const booking = await bookingService.getSingleBooking(user?, booking_id);

        res.status(200).json({
            success: true,
            message: "Booking retrieved successfully",
            data: booking
        });

    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};