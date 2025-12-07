import app from "./app";
// import pool from "./config/DB";
import {pool} from "./config/db"
// import initDB from "./config/DB";
import config from "./config";

const port = config.port || 5000;

pool.connect()
  .then(() => console.log("Connected to Neon DB"))
  .catch((err) => console.error("DB Connection Error:", err));

app.listen(port, () => {
  console.log(`VRS Server is running on http://localhost:${port}`);
});
