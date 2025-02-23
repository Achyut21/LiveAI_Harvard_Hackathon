import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('DB is connected');
}).catch((err)=>{
    console.log(err);
});

const app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000!!!');
    }
);

app.use(express.json());
app.use(cors());

app.use('/user', userRoutes);