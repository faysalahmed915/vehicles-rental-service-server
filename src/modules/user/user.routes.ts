import express, { Request, Response } from "express";
import logger from "../../middlewares/logger";
import { userControllers } from "./user.controller";
// import logger from "../../middleware/logger";
// import auth from "../../middleware/auth";

const router = express.Router();

// app.use("/users", userRooutes)

// routes -> controller -> service

router.post("/", userControllers.createUser);

router.get("/", logger, userControllers.getUser);

router.get("/:id", userControllers.getSingleUser);

router.put("/:id", userControllers.updateUser);

router.delete("/:id", userControllers.deleteUser);

export const userRoutes = router;