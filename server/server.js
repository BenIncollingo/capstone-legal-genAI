import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./src/routes/index.js";
import deleteDocumentRoutes from "./src/routes/deleteDocument.routes.js";



dotenv.config();

console.log("ENV TEST:", {
  base: process.env.INFRA_BASE_URL,
  project: process.env.PROJECT_ID,
  key: process.env.API_KEY ? "loaded" : "missing",
});

const app = express();
const port = process.env.PORT || 8080;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean);


app.use(
  cors({
    origin(origin, callback) {
      console.log("CORS origin:", origin);
      console.log("Allowed origins:", allowedOrigins);

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use("/api", apiRoutes);
app.use("/api/documents", deleteDocumentRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
