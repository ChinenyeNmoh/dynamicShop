import express from 'express'
import { protect, ensureAdmin} from '../middleswares/authMiddleware.js';
import { uploadImages, deleteImages } from '../controllers/uploadContoller.js'
import { uploadPhoto, productImgResize } from '../utils/upload.js'
const router = express.Router()

router.post(
  "/",
  protect,
  ensureAdmin,
  uploadPhoto.array("images", 1), // means i want to upload 10 photos at once
  productImgResize,
  uploadImages
);

router.delete("/deleteimage/:id", protect, ensureAdmin, deleteImages);

export default router