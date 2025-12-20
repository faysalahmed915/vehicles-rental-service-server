import express, { Request, Response } from "express";
import logger from "../../middlewares/logger";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
// import logger from "../../middleware/logger";
// import auth from "../../middleware/auth";

const router = express.Router();

// app.use("/users", userRooutes)

// routes -> controller -> service

// router.post("/", userControllers.createUser);

router.get("/", logger, auth("admin"), userControllers.getUser);

router.get("/:userId", auth("admin", "customer"), userControllers.getSingleUser);

router.put("/:userId", userControllers.updateUser);

router.delete("/:userId", userControllers.deleteUser);

export const userRoutes = router;