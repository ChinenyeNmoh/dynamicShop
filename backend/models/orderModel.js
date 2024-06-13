import mongoose from "mongoose";


const orderSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
      subTotal: {
        type: Number,
        default: 0.0,
      },
      subTotalAfterCoupon: {
        type: Number,
      },
      shippingFee: {
        type: Number,
        default: 5000.0,
      },
      finalPrice: {
        type: Number,
        default: 0.0,
      },
      products: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          quantity: {
            type: Number,
          },
          price: {
            type: Number,
          },
        },
      ],
      paidAt: {
        type: Date,
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending",
      },
      paymentMethod: {
        type: String,
        enum: ["cash on delivery", "card"],
        required: true,
      },
      orderStatus: {
        type: String,
        enum: ["ordered", "delivered"],
        default: "ordered",
      },
      deliveredAt: {
        type: Date,
      }
    },
    { timestamps: true }
  );
    export default mongoose.model("Order", orderSchema);  