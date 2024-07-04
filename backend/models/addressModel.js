import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  recipientName: {
    type: String,
    required: true,
    trim: true,
  },
  street: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    
  },
  
  country: {
    type: String,
  },
  recipientMobile: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});
export default mongoose.model('Address', addressSchema);