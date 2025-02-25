import express from "express";
import authroutes from "./routes/auth.route.js";
import messageroutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authroutes);
app.use("/api/messages", messageroutes);

server.listen(PORT, () => {
  console.log("Server is running on port:" + PORT);
  connectDB();
});
