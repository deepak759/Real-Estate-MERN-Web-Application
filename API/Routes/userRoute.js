import express from "express";
import  {getUser, signup,signin,google, updateUserInfo}  from "../Controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", getUser );
router.post("/signup", signup );
router.post("/signin", signin );
router.post("/google", google );
router.post("/update/:id",verifyToken, updateUserInfo );

export default router;