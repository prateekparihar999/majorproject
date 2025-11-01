const mongoose = require("mongoose");
const Review = require("./review");

const { Schema } = mongoose; //  Extract Schema

const listingSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"], 
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be positive"],
  },
  location: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: [
        'trending', 'rooms', 'iconic', 'mountains', 'castles', 'pools', 
        'camping', 'farms', 'arctic', 'domes', 'boats'
    ],
    lowercase: true,
    default: 'trending'
 },

reviews: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
  },
],
owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews },
    })
  }
});


const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing
