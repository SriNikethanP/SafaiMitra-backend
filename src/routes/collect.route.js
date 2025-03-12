import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {order, upload} from "../controllers/order.controller.js";


const router = express.Router();

router.post("/order", protectRoute, order);

router.post("/upload", protectRoute, upload);


export default router;