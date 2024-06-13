import Product from '../models/productModel.js';
import ProductType from '../models/typeModel.js';
import asyncHandler from 'express-async-handler';

// Create productType
const createType = asyncHandler(async (req, res) => {
  const newType = await ProductType.findOne({ title: req.body.title });

  if (newType) {
    res.status(400);
    throw new Error(`${req.body.title} type has already exist`);
  }

  const type = await ProductType.create(req.body);

  res.status(200).json({
    message: `${req.body.title} type created`,
    data: type,
  });
});

// Update productType
const updateType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const type = await ProductType.findById(id);

  if (!type) {
    res.status(404);
    throw new Error("Product type not found");
  }

  const updatedType = await ProductType.findByIdAndUpdate(id, req.body, { new: true });

  res.status(200).json({
    message: "Product type updated successfully",
    data: updatedType,
  });
});

// Delete a product type
const deleteType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const type = await ProductType.findById(id);

  if (!type) {
    res.status(404);
    throw new Error("Product type not found");
  }

  await ProductType.findByIdAndDelete(id);

  res.status(200).json({
    message: "Product Type deleted successfully",
  });
});

// Get a type
const getType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const type = await ProductType.findById(id);

  if (!type) {
    res.status(404);
    throw new Error("Product type not found");
  }

  res.status(200).json({
    message: "Success",
    data: type,
  });
});

// Get all types
const getAllType = asyncHandler(async (req, res) => {
  const all = await ProductType.find();

  if (!all || all.length === 0) {
    res.status(404);
    throw new Error("No Product type found");
  }

  const counter = await ProductType.countDocuments();

  res.status(200).json({
    message: "Success",
    count: counter,
    data: all,
  });
});

export {
  createType,
  updateType,
  deleteType,
  getType,
  getAllType,
};