import {
    cloudinaryUploadImg,
    cloudinaryDeleteImg,
  } from "../utils/cloudinary.js";
import fs from "fs";
import asyncHandler from "express-async-handler";

const uploadImages = asyncHandler(async (req, res) => {
  // Define a function 'uploader' that uses the 'cloudinaryUploadImg' function with a specified folder ("images")
  const uploader = (path) => cloudinaryUploadImg(path, "images");

  // Initialize an array to store Cloudinary URLs of the uploaded images
  const urls = [];

  // Retrieve the files from the request
  const files = req.files;

  // Loop through each file in the request
  for (const file of files) {
    // Extract the 'path' property from the file
    const { path } = file;

    // Upload the image to Cloudinary and get the Cloudinary URL
    const newpath = await uploader(path);
    // Add the Cloudinary URL to the 'urls' array
    urls.push(newpath);

    // Delete the temporarily stored file on the server after uploading to Cloudinary
    fs.unlink(path, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`File ${path} deleted successfully`);
      }
    });
  }

  const images = urls.map((file) => file);
  res.status(200).json({
    message: "Image uploaded successfully",
    data: images,
  });
});

const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await cloudinaryDeleteImg(id, "images");

  res.status(200).json({ message: "Image Deleted" });
});

export { uploadImages, deleteImages };
