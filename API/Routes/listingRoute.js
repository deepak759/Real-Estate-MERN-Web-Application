import express from "express";
import { createListing,getListing,deleteListing,editListing,getSpecListing } from "../Controllers/listingController.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", verifyToken, createListing);
router.get("/get/:id", verifyToken, getListing);
router.get("/getspec/:id", getSpecListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/edit/:id", verifyToken, editListing);


export default router;
