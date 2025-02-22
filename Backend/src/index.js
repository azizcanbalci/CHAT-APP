import express from 'express';
import authroutes from './routes/auth.route.js';
import messageroutes from './routes/message.route.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';


dotenv.config();
const app = express();
const PORT = process.env.PORT 

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authroutes);
app.use("/api/message", messageroutes);

app.listen(PORT, () => {
    console.log('Server is running on port:' + PORT);
    connectDB()

});