import { Router } from "express";
import { testData } from "../services/data.service.js";

const router = Router();

router.get("/test", (req, res) => {
  console.log("route hit: /api/data/test");
  testData();
  res.json({ message: "data route working" });
});

export default router;
