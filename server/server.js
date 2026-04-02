import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./src/routes/index.js";

dotenv.config();

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

app.listen(port, () => console.log(`http://localhost:${port}`));