import express from 'express'
const router = express.Router()
import { checkOut, getOrderById, getOrders } from '../controllers/orderController.js';
import { protect, validateId } from '../middleswares/authMiddleware.js';

router.post('/', protect,  checkOut)
router.get('/', protect, getOrders)
router.get('/:id', protect, validateId, getOrderById)

export default router;
