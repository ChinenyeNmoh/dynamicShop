import Coupon from "../models/couponModel.js";
import asyncHandler from "express-async-handler";

// Create coupon
const createCoupon = asyncHandler(async (req, res) => {
    const { name, discount } = req.body;
    const existingCoupon = await Coupon.findOne({ name });
    if (existingCoupon) {
        return res.status(400).json({ error: "Coupon already exists" });
    }
    const coupon = await Coupon.create({ name, discount });
    return res.status(201).json({ message: "Coupon created successfully", coupon });
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
    coupon.name = req.body.name || coupon.name;
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
