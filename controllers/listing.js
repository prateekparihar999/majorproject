const Listing = require("../models/listing");
const mongoose = require("mongoose");

//  INDEX ROUTE
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

//  NEW LISTING FORM
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

//  SHOW LISTING
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid Listing ID!");
    return res.redirect("/listings");
  }

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" } // populate review author
    })
    .populate("owner"); // populate listing owner

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing, currUser: req.user });
};

//  CREATE LISTING
module.exports.createListing = async (req, res) => {
   let url = req.file.path;
   let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect(`/listings/${newListing._id}`);
};

//  EDIT LISTING
module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
};

//  UPDATE LISTING
module.exports.updateListing = async (req, res) => {
 const { id } = req.params;
 let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
if (typeof req.file !== 'undefined') {
 let url = req.file.path;
 let filename = req.file.filename;
 listing.image = { url, filename };
 await listing.save();
  }

 req.flash("success", "Listing Updated!");
 res.redirect(`/listings/${id}`);
};

//  DELETE LISTING
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid Listing ID!");
    return res.redirect("/listings");
  }

  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    req.flash("error", "Listing not found for deletion!");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

