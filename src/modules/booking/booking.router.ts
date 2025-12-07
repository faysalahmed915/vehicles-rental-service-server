import { Router } from "express";
import * as bookingController from "./booking.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth("customer", "admin"), bookingController.createBooking);
router.get("/", auth("customer", "admin"), bookingController.getBookings);

export default router;
