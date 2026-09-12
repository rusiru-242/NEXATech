const mongoose = require("mongoose");

const DIRECT_ATLAS_URI =
  "mongodb://anjanisachinika72_db_user:20030611@ac-bswwkbu-shard-00-00.mgwy5gz.mongodb.net:27017,ac-bswwkbu-shard-00-01.mgwy5gz.mongodb.net:27017,ac-bswwkbu-shard-00-02.mgwy5gz.mongodb.net:27017/?ssl=true&replicaSet=atlas-foi1zo-shard-0&authSource=admin&retryWrites=true&w=majority";

const connectDB = async ({ retries = 5, delayMS = 3000 } = {}) => {
  const primaryUri = process.env.MONGO_URI;

  if (!primaryUri) {
    console.error("FATAL: MONGO_URI is not set in environment.");
    if (process.env.NODE_ENV === "production" || process.env.ENVIRONMENT === "production") {
      process.exit(1);
    }
    return false;
  }

  const urisToTry = [primaryUri];
  if (DIRECT_ATLAS_URI && primaryUri !== DIRECT_ATLAS_URI) {
    urisToTry.push(DIRECT_ATLAS_URI);
  }

  for (const uri of urisToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const conn = await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 10000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return true;
      } catch (error) {
        console.error(
          `MongoDB connection attempt with ${uri.startsWith("mongodb+srv") ? "SRV URI" : "Direct URI"} failed: ${error.message}`
        );
      }
    }
  }

  console.error(
    "MongoDB connection failed after multiple attempts.\n" +
    "Please check the following:\n" +
    " - Ensure `MONGO_URI` in backend/.env is correct (user, password, host).\n" +
    " - Your machine's IP is whitelisted in the Atlas network access settings (if using Atlas).\n" +
    " - You have network access to the MongoDB server (VPN / firewall).\n" +
    "The server will continue to run but database functionality will be unavailable until a connection is established."
  );
  return false;
};

module.exports = connectDB;