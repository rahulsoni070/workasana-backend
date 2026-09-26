const mongoose = require("mongoose");

let connection = null;

// Reuse one connection per server instance. On a serverless host (Vercel) a
// failed connect must not kill the process, so the next request can retry.
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!connection) {
    connection = mongoose.connect(process.env.MONGO_URI).then(
      (m) => {
        console.log("MongoDB connected");
        return m;
      },
      (error) => {
        connection = null;
        console.log("MongoDB connection failed:", error.message);
        throw error;
      }
    );
  }
  return connection;
};

module.exports = connectDB;
