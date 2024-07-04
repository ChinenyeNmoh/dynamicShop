import express from "express";
import dotenv from "dotenv";
import userRoutes from './routes/userRoutes.js';
import imageRoutes from './routes/uploadRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import typeRoutes from './routes/typeRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleswares/errorMiddleware.js'
import connectDB from "./config/db.js"
import cookieParser from 'cookie-parser';
import morgan from "morgan";
import passport from 'passport';
import configurePassport from "./config/passport.js";
import session from 'express-session';
import MongoStore from "connect-mongo";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from "cors";


dotenv.config();


const port= process.env.port || 5000;

const app = express()

connectDB();

// Passport config
configurePassport(passport);
   

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.header({"Access-Control-Allow-Origin": "*"});
  next();
}) 

app.use(cors());


app.use(
    session({
      name: 'passportSessionId',
      resave: false,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 60000 * 60 * 24
    },
      // creates session in the database with cookie
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    })
  );

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Define __dirname and __filename for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// path to our static folders
app.use(express.static(path.join(__dirname, 'public')));

// Logging using morgan middleware only if we are in development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

// route handlers
app.use('/api/users', userRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/types', typeRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/orders', orderRoutes);
app.use(notFound);
app.use(errorHandler);


app.listen(port, () => {
    console.log(`app is running on port ${port}`)
})