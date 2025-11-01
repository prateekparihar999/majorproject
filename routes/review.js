// routes/review.js
const express = require("express");
const router = express.Router({ mergeParams: true }); // <-- important
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { validateReview, isLoggedIn } = require("../middleware.js");
const reviewControllers = require("../controllers/reviews.js");


// POST /listings/:id/reviews  -> add new review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewControllers.createReview)
);

// DELETE /listings/:id/reviews/:reviewId  -> delete review
router.delete(
  "/:reviewId",
  wrapAsync(reviewControllers.deleteReview)
);

module.exports = router;
