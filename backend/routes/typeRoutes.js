import express from 'express'
import {
    createType,
    updateType,
    deleteType,
    getType,
    getAllType,
  } from  '../controllers/typeContoller.js';
import { protect,  ensureAdmin, validateId } from '../middleswares/authMiddleware.js';

const router = express.Router()

router.post('/', protect, ensureAdmin, createType)
router.put('/:id', validateId, protect, ensureAdmin, updateType)
router.delete('/:id', validateId, protect, ensureAdmin, deleteType)
router.get("/:id", getType);
router.get("/", getAllType);

export default router;