import express from "express";
import dotenv from "dotenv";
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleswares/errorMiddleware.js'
import connectDB from "./config/db.js"
import cookieParser from 'cookie-parser';
import morgan from "morgan";


dotenv.config();

const port= process.env.port || 5000;

const app = express()

connectDB();
// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


   

// Logging using morgan middleware only if we are in development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

// route handlers
app.use('/api/users', userRoutes);
app.use(notFound);
app.use(errorHandler);



app.get('/', (req, res) => {
    res.send('Hello World')
})


  

app.listen(port, () => {
    console.log(`app is running on port ${port}`)
})