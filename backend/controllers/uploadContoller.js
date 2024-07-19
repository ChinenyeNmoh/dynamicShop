import {
    cloudinaryUploadImg,
    cloudinaryDeleteImg,
  } from "../utils/cloudinary.js";
import fs from "fs";
import asyncHandler from "express-async-handler";

const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");

    // Retrieve the files from the request
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadResults = await Promise.all(files.map(async (file) => {
      const { path } = file;
      const newpath = await uploader(path);

      // Delete the temporarily stored file on the server after uploading to Cloudinary
      fs.unlink(path, (err) => {
        if (err) {
          console.error(`Failed to delete file ${path}: ${err}`);
        } else {
          console.log(`File ${path} deleted successfully`);
        }
      });

      return newpath;
    }));

    res.status(200).json({
      message: "Images uploaded successfully",
      imageUrls: uploadResults,
    });

  } catch (err) {
    console.log('Error uploading image:', err);
    res.status(500).json({ message: 'Failed to upload image', error: err.message });
  }
});

const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await cloudinaryDeleteImg(id, "images");

  res.status(200).json({ message: "Image Deleted" });
});

export { uploadImages, deleteImages };
