const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
    console.log("Review POST request received!"); 
    console.log("Request Body (req.body):", req.body);
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // ✅ declare before using
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
  };   

  module.exports.deleteReview = async (req, res) => {
      const { id, reviewId } = req.params;
  
      // Pull review id from listing.reviews array
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  
      // Delete Review doc
      await Review.findByIdAndDelete(reviewId);
  
      req.flash("success", "Review deleted!");
      res.redirect(`/listings/${id}`);
    };