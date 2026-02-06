import express from "express";
import cors from "cors";
import apiRoutes from "./src/routes/index.js";

const app = express();
app.use(express.json());
const port = 8080;

app.use("/api", apiRoutes);

app.listen(port, () => console.log(`http://localhost:${port}`));
