import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import cors from "cors"

import authRoute from './routes/athu.route.js';
import { connectDB } from "./lib/db.js";
import messageRouter from "./routes/messageRoute.js";
import { app , server} from "./lib/socketio.js";
import path from "path";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();
app.use(express.json({ limit: "50mb" }))
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

app.use("/api/athu", authRoute);
app.use("/api/messages", messageRouter);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
 
server.listen(PORT,()=>{
    console.log("server is run, in the port number " + PORT);
    connectDB()
    
})