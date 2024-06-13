import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    unique: true
  }
}, {
  timestamps: true,
  collection: 'category'
});
export default mongoose.model('Category', categorySchema);