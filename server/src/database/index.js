import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === "production";
const instanceConnectionName = process.env.INSTANCE_CONNECTION_NAME;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host:
    isProduction && instanceConnectionName
      ? `/cloudsql/${instanceConnectionName}`
      : process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
});

pool
  .connect()
  .then((client) => {
    console.log("Connected to PostgreSQL");
    client.release();
  })
  .catch((err) => console.error("PostgreSQL connection error:", err));

export default pool;