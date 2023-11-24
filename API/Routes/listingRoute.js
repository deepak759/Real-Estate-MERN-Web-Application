import express from "express";
import { createListing,getListing } from "../Controllers/listingController.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", verifyToken, createListing);
router.get("/get/:id", verifyToken, getListing);

export default router;
