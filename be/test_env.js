import dotenv from "dotenv";
dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("Injected count:", Object.keys(process.env).filter(k => k === "MONGO_URI" || k === "PORT" || k === "NODE_ENV").length);
