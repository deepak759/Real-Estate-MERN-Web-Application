import express from "express";
import  {getUser, signup,signin,google}  from "../Controllers/userController.js";

const router = express.Router();

router.get("/", getUser );
router.post("/signup", signup );
router.post("/signin", signin );
router.post("/google", google );

export default router;