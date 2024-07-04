import express from 'express'
const router = express.Router()
import {createAddress, getAddress
} from  "../controllers/addressController.js"
import { protect } from '../middleswares/authMiddleware.js';

router.post('/', protect,  createAddress)
router.get('/', protect, getAddress)

export default router;