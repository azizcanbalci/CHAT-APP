import express from 'express';
import authroutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/auth", authroutes);

const PORT = process.env.PORT 

app.listen(PORT, () => {
    console.log('Server is running on port:' + PORT);
    connectDB()

});