import express from 'express';
const router = express.Router();
import { createEnquiry, deleteEnquiry, getEnquiries, getEnquiryById, updateEnquiry } from '../controllers/enquiryController.js';
import { protect, ensureAdmin } from '../middleswares/authMiddleware.js';

router.post('/',  createEnquiry);

router.get('/', protect, ensureAdmin, getEnquiries);

router.get('/:id', protect, ensureAdmin, getEnquiryById);

router.put('/:id', protect, ensureAdmin, updateEnquiry);

router.delete('/:id', protect, ensureAdmin, deleteEnquiry);

export default router;