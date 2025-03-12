import express from "express";
import { signup, login, logout,  checkAuth, captainsignup, captainlogin} from "../controllers/auth.controller.js";
import { order } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/captainsignup", captainsignup);

router.post("/login", login);

router.post("/captainlogin", captainlogin);

router.post("/logout", logout);

router.get("/checkauth", checkAuth);


export default router;