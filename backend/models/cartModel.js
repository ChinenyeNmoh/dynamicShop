import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number
        },
        price: Number,
      },
    ],
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    cartTotal: {
      type: Number,
      default: 0.0,
    },
    totalAfterCoupon: {
      type: Number,
      default: 0.0,
    },
    shippingFee: {
      type: Number,
      default: 0.0,
    }, taxFee: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      default: 0.0,
    },
    paymentMethod: {
      type: String,
      enum: ["cashOnDelivery", "paypal", "flutterwave"],
      default: "cashOnDelivery",
      required: true,
    },
    orderedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Cart", cartSchema);