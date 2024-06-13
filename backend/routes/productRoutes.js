import express from 'express'
const router = express.Router()
import {createProduct,
    getProduct,
    getAllProduct,
    updateProduct,
    productRating,
    deleteProduct
} from  "../controllers/productController.js"
import { protect,   ensureAdmin, validateId, validateQuery } from '../middleswares/authMiddleware.js';

router.post('/', protect, ensureAdmin, createProduct)
router.get('/', validateQuery, getAllProduct)
router.get('/:id', validateId, getProduct)
router.put('/update/:id', protect, ensureAdmin, validateId, updateProduct)
router.delete('/delete/:id', protect, ensureAdmin, validateId, deleteProduct)
router.post("/rating", protect, productRating)


export default router