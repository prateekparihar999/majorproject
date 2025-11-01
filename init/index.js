// init/index.js

require("dotenv").config({ path: "../.env" }); 
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// ✅ Use Atlas or local MongoDB as fallback
const dbUrl = process.env.ATLAS_DB_URL ;

if (!dbUrl) {
  console.error("❌ Error: MongoDB connection string not found. Please set ATLAS_DB_URL in your .env file.");
  process.exit(1);
}

// 🧠 Connect to MongoDB
async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Connection Error:", err);
    process.exit(1);
  }
}

// 🧹 Initialize DB
const initDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log("🗑️ Old listings deleted");

    const listings = initData.map((obj) => ({
      ...obj,
      owner: "68ebe65b44486898aacdaef6", // replace with your actual user _id from MongoDB
    }));

    await Listing.insertMany(listings);
    console.log(`🌱 Seeded ${listings.length} listings successfully!`);
  } catch (err) {
    console.error("❌ Error initializing DB:", err);
  } finally {
    await mongoose.connection.close();
    console.log("🔒 MongoDB connection closed");
  }
};

// 🚀 Run
main().then(initDB);
