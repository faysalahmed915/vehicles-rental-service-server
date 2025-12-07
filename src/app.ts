import express, { Request, Response } from "express";
import initDB, { pool } from "./config/db";
import logger from "./middlewares/logger";
import { userRoutes } from "./modules/user/user.routes";

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


app.use("/users", userRoutes);


export default app;
