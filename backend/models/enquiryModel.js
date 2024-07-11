import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    
  },
  email: {
    type: String,
    required: true,
    
  },
  mobile: {
    type: String,
    required: true,
   
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "submitted",
    enum: ["submitted",  "resolved"],
  },
});

export default mongoose.model('Enquiry', enquirySchema);