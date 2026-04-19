//This file is the hub for all of our endpoints
//all calls to our API start here and then spread out to other files based on their responsibities

import express from "express";
import pool from "../database/index.js";
import { Router } from "express";
import chatRoutes from "./chat.routes.js";
import documentRoutes from "./documents.routes.js";
import conversationRoutes from "./conversation.routes.js";

const router = express.Router(); 

router.use("/chat", chatRoutes); //all the routes regarding chatting with infras API
router.use("/documents", documentRoutes); //all the routes regarding document upload to Infra API
router.use("/db", conversationRoutes); //all the routes regarding communication with our CloudSQL instance holding chat history

export default router;