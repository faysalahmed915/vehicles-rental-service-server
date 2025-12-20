import { Router } from "express";
import * as bookingController from "./booking.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/", auth("admin", "customer"), bookingController.createBooking);
router.get("/", auth("admin"), bookingController.getBookings);
router.get("/:bookingId", auth("admin", "customer"), bookingController.getSingleBooking);

router.put("/:bookingId", auth("admin", "customer"), bookingController.updateBooking);

export const bookingRoutes = router;