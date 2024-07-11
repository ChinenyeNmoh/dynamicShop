import Coupon from "../models/couponModel.js";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4, v4 } from 'uuid';

// Create coupon
const createCoupon = asyncHandler(async (req, res) => {
     // Generate a unique identifier
     const n = v4();
     // Create a new coupon with a unique name and a fixed discount
     const coupon = await Coupon.create({ 
         title: 'test' + n.toString().substring(0, 3), 
         discount: 10 
     });
     return res.status(201).json({ 
         message: "Coupon created successfully", 
         coupons: coupon 
     });
});

// Get all coupons
const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({});
    if (!coupons.length) {
        return res.status(404).json({ error: "No coupons found" });
    }
    return res.status(200).json({
        message: "Coupons retrieved successfully",
        coupons,
    });
});

// Get coupon by id
const getCouponById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
        return res.status(404).json({ error: "Coupon not found" });
    }
    return res.status(200).json({
        message: "Coupon retrieved successfully",
        coupon,
    });
});

// Update coupon
const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
        return res.status(404).json({ error: "Coupon not found" });
    }
    coupon.name = req.body.title || coupon.title;
    coupon.discount = req.body.discount || coupon.discount;
    const updatedCoupon = await coupon.save();
    return res.status(200).json({
        message: "Coupon updated successfully",
        coupon: updatedCoupon,
    });
});

// Delete coupon
const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
        return res.status(404).json({ error: "Coupon not found" });
    }
    await Coupon.findByIdAndDelete(id);
    return res.status(200).json({ message: "Coupon deleted successfully" });
});

export { createCoupon, getCoupons, getCouponById, updateCoupon, deleteCoupon };
