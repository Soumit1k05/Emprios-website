import mongoose from "mongoose";
import dns from "dns";

// Bypass local DNS issues which are common on some networks (ECONNREFUSED)
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      tls: true,
      ssl: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // Log helpful diagnostic for SRV issues
    if (error.message.includes('ECONNREFUSED') && process.env.MONGO_URI.includes('+srv')) {
       console.log("HINT: Your local network's DNS server is blocking MongoDB SRV records. Try adding 'srv: false' to your connection or use the standard connection string.");
    }
    process.exit(1);
  }
};

export default connectDB;