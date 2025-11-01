const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// INDEX ROUTE,CREATE LISTING
router.route("/")
.get( wrapAsync(listingController.index))
.post( isLoggedIn,upload.single('image'), validateListing,
 wrapAsync( listingController.createListing));

//  NEW LISTING FORM
router.get("/new", isLoggedIn, listingController.renderNewForm);

//   SEARCH ROUTE (MUST COME BEFORE :id)
router.get("/search", wrapAsync(async (req, res) => {
  const query = req.query.q;

  if (!query) {
    req.flash("error", "Please enter a search term");
    return res.redirect("/listings");
  }

  const listings = await Listing.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
    ],
  });

  if (listings.length === 0) {
    req.flash("error", `No listings found for "${query}"`);
    return res.redirect("/listings");
  }

  res.render("listings/index", { allListings: listings, query });
}));

//  FILTER BY CATEGORY
router.get("/category/:category", wrapAsync(async (req, res) => {
  const { category } = req.params;
  const listings = await Listing.find({ category });

  if (listings.length === 0) {
    req.flash("error", `No listings found in ${category}`);
    return res.redirect("/listings");
  }

  res.render("listings/index", { allListings: listings, query: category });
}));


//  SHOW LISTING ,UPDATE LISTING,DELETE LISTING
router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isLoggedIn, isOwner, upload.single('image'),validateListing, wrapAsync(listingController.updateListing))
.delete( isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//  EDIT FORM
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;
