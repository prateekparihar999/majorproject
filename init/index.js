const mongoose = require("mongoose");
const initData = require("./data.js"); //  exports an array directly
const Listing = require("../models/listing.js");

const MONGO_URI = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log(" Connected to MongoDB");
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});

    //  use initData.map() (not initData.data.map)
    const listings = initData.map((obj) => ({
      ...obj,
      owner: "68ebe65b44486898aacdaef6",
    }));

    await Listing.insertMany(listings);
    console.log(" Database initialized with data");

  } catch (err) {
    console.error(" Error initializing DB:", err);
  } finally {
    await mongoose.connection.close();
    console.log(" Connection closed");
  }
};

main()
  .then(() => initDB())
  .catch((err) => console.error(" Connection Error:", err));
