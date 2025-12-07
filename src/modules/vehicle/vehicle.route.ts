import { Router } from "express";
import vehicleController from "./vehicle.controller";
import auth from "../../middlewares/auth";

const router = Router();

// admin only routes
router.post("/", auth("admin"), vehicleController.createVehicle);
router.put("/:id", auth("admin"), vehicleController.updateVehicle);
router.delete("/:id", auth("admin"), vehicleController.deleteVehicle);

// public routes
router.get("/", vehicleController.getAllVehicles);
router.get("/:id", vehicleController.getSingleVehicle);

export const vehicleRoutes = router;
