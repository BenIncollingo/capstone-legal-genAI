import { Router } from "express";
import chatRoutes from "./chat.routes.js";
import documentRoutes from "./documents.routes.js";
//import adminRoutes from "./admin.routes.js";

const router = Router();

router.use("/chat", chatRoutes)
router.use("/documents", documentRoutes);
//router.use("/admin", adminRoutes);

export default router;
