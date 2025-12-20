import { Router } from "express";
import vehicleController from "./vehicle.controller";
import auth from "../../middlewares/auth";

const router = Router();

// admin only routes
router.post("/", auth("admin"), vehicleController.createVehicle);
router.put("/:vehicleId", auth("admin"), vehicleController.updateVehicle);
router.delete("/:vehicleId", auth("admin"), vehicleController.deleteVehicle);

// public routes
router.get("/", vehicleController.getAllVehicles);
router.get("/:vehicleId", vehicleController.getSingleVehicle);

export const vehicleRoutes = router;
