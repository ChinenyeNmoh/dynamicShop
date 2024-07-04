import express from 'express'
const router = express.Router()
import { createCart, getCart, deleteItem, emptyCart, updateCart, applyCoupon } from '../controllers/cartController.js';
import { protect } from '../middleswares/authMiddleware.js';

router.post('/', protect,  createCart)
router.get('/', protect,  getCart)
router.delete('/:id', protect,  deleteItem)
router.delete('/', protect,  emptyCart)
router.put('/', protect,  updateCart)
router.post('/applycoupon', protect,  applyCoupon)


export default router;