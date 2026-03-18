import express from "express";
import cors from "cors";
import apiRoutes from "./src/routes/index.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.REACT_APP_BACKEND_PORT || 8080;

const allowedOrigins = [
  process.env.REACT_APP_FRONTEND_URL,
  "http://localhost:3000", 
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use("/api", apiRoutes);

app.listen(port, () => console.log(`${process.env.REACT_APP_BACKEND_URL}`));
