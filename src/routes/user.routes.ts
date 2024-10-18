import express from "express";


import  { protect,restrictTo} from "../middlewares/auth.middleware";
import { loginUser,signup} from "../controllers/user.controller";

const router = express.Router();

// Define user registration route
router.post("/register", signup);
router.post("/login", loginUser);


export default router;
