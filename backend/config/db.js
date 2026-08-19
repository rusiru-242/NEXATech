const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async ({ retries = 5, delayMS = 3000 } = {}) => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("MONGO_URI is not set in environment. Skipping MongoDB connection.");
    return false;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      console.error(
        `MongoDB connection attempt ${attempt} failed: ${error.message}`
      );

      if (attempt < retries) {
        console.log(`Retrying in ${delayMS}ms... (${attempt}/${retries})`);
        // eslint-disable-next-line no-await-in-loop
        await new Promise((res) => setTimeout(res, delayMS));
      } else {
        console.error(
          "MongoDB connection failed after multiple attempts.\n" +
          "Please check the following:\n" +
          " - Ensure `MONGO_URI` in backend/.env is correct (user, password, host).\n" +
          " - Your machine's IP is whitelisted in the Atlas network access settings (if using Atlas).\n" +
          " - You have network access to the MongoDB server (VPN / firewall).\n" +
          "The server will continue to run but database functionality will be unavailable until a connection is established."
        );
        return false;
      }
    }
  }
};

module.exports = connectDB;