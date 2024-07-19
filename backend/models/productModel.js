import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    discountedPrice: {
      type: Number,
      default: 0
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Category',
      required: false
    },
    productType: {
      type: mongoose.Schema.Types.ObjectId, ref: 'ProductType',
      required: false
    },
    quantity: {
      type: Number,
      min: 0
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: [
      {
        url: String,
      },
    ],
    ratings: [
      {
        star: Number,
        comment: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        dateCreated: { type: Date, default: Date.now },
      },
    ],
    totalrating: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);

//Export the model
export default mongoose.model("Product", productSchema);