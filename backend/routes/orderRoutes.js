import express from 'express'
const router = express.Router()
import { 
    checkOut, 
    myOrders, 
    getOrderById, 
    userOrders, 
    allOrders, 
    confirmDelivery,
    deleteOrder
} from '../controllers/orderController.js';
import { protect, validateId , ensureAdmin} from '../middleswares/authMiddleware.js';

router.post('/', protect,  checkOut)
router.get('/allorders', protect, ensureAdmin, allOrders)
router.get('/:id', validateId, protect, getOrderById)
router.get('/', protect,  myOrders)
router.get('/user/:id', protect, ensureAdmin, validateId, userOrders)
router.put('/:id', protect, ensureAdmin, validateId, confirmDelivery)
router.delete('/:id', protect, ensureAdmin, validateId, deleteOrder)


export default router;
