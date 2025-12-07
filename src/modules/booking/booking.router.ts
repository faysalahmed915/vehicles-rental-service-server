import { Router } from "express";
import * as bookingController from "./booking.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/", auth("admin", "customer"), bookingController.createBooking);
router.get("/", auth("admin"), bookingController.getBookings);
router.get("/:booking_id", auth("admin", "customer"), bookingController.getSingleBooking);

router.put("/:booking_id", auth("admin", "customer"), bookingController.updateBooking);

export const bookingRoutes = router;