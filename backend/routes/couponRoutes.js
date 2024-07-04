import express from 'express'
const router = express.Router()
import { createCoupon, getCoupons, getCouponById, updateCoupon, deleteCoupon } from '../controllers/couponController.js';
import { protect, ensureAdmin } from '../middleswares/authMiddleware.js';

router.post('/', protect,  ensureAdmin, createCoupon)
router.get('/', protect, getCoupons)
router.get('/:id', protect, getCouponById)
router.put('/:id', protect, ensureAdmin, updateCoupon)
router.delete('/:id', protect, ensureAdmin, deleteCoupon)

export default router;