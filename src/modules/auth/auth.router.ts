import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

// http://localhost:5000/api/v1/auth/signin
router.post("/signup", authController.signup);
router.post("/signin", authController.signinUser);

export const authRoutes = router;