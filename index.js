import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
 import connectDB from './Database/dbConfig.js';
 import hotelRoutes from './Routers/hotelRouter.js';
import paymentRoutes from './Routers/paymentRouter.js';
import userRoutes from './Routers/userRouter.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get("/",(req,res)=>{
    res.status(200).send("Welcome to our API")
})

// Use Routes
app.use('/api/hotels', hotelRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

// 404 Error Handling (if route doesn't match)
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});


const port = process.env.PORT || 4000
 app.listen(port,() => {
    console.log("Server Running Succesfully");
 });