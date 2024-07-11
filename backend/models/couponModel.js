import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const  couponSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    expireAt: { 
      type: Date,
      expires: '2d', // Expires after 2 day
      index: true, 
      default: Date.now,
  },
    discount: {
      type: Number,
      required: true,
    },
  });
  export default mongoose.model("Coupon", couponSchema);