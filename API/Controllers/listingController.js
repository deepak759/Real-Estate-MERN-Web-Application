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
export const getSpecListing = async (req, res, next) => {
  
  try {
    const listing = await Listing.findById(req.params.id);
    if(!listing)return next(errorHandler(404,"listing not found"))
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
  if (!listing) 
   
    return next(errorHandler(404, "listing not found"));
  
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


export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['Sale', 'Rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
console.log(listings)
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};