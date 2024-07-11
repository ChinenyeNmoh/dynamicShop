import mongoose from "mongoose";


const orderSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
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
      paidAt: {
        type: Date,
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending",
      },
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
      orderStatus: {
        type: String,
        enum: ["ordered", "delivered"],
        default: "ordered",
      },
      deliveredAt: {
        type: Date,
      },
      paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
      },
    },
    { timestamps: true }
  );
    export default mongoose.model("Order", orderSchema);  