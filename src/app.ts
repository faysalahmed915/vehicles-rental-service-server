import express, { Request, Response } from "express";
import initDB, { pool } from "./config/db";
import logger from "./middlewares/logger";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.router";
import { vehicleRoutes } from "./modules/vehicle/vehicle.route";

const app = express();

app.use(express.json());

initDB();

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Vehicles Rental Service is running!");
});

app.get("/db-test", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
  // console.log("database working");
});


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
// app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/users", userRoutes);



app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});



export default app;
