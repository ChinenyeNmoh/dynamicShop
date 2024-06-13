import express from 'express'
const router = express.Router()
import { createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategory

} from  "../controllers/categoryController.js"
import { protect,  ensureAdmin, validateId } from '../middleswares/authMiddleware.js';

router.post('/', protect, ensureAdmin, createCategory)
router.put('/:id', validateId, protect, ensureAdmin, updateCategory)
router.delete('/:id', validateId, protect, ensureAdmin, deleteCategory)
router.get("/:id", getCategory);
router.get("/", getAllCategory);

export default router;