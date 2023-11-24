import Listing from "../Models/Listing_model.js";
import { errorHandler } from "../utils/error.js";
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only acces your listing"));
  try {
    const listing = await Listing.find({ userRef: req.params.id });
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "listing not found"));
    if (req.user.id !== listing.userRef)
      return next(errorHandler(401, "you can only delete you own listting"));
    const data = await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const editListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "listing not found"));

    if (req.user.id !== listing.userRef)
      return next(errorHandler(401, "you can only Edit you own listting"));
    const data = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
