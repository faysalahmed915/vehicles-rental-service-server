import express from "express";
import initDB, { pool } from "./config/DB";

const app = express();

// app.use(express.json());
initDB();

app.get("/", (req, res) => {
  res.send("API is running!");
});

app.get("/db-test", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
});

export default app;
