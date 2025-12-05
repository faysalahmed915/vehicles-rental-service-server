import app from "./app";
// import pool from "./config/DB";
import {pool} from "./config/DB"
// import initDB from "./config/DB";

const port = 5000;

pool.connect()
  .then(() => console.log("Connected to Neon DB"))
  .catch((err) => console.error("DB Connection Error:", err));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
