import { v4 as uuidv4, v4 } from 'uuid';
import ProductType from '../models/typeModel.js';
import asyncHandler from 'express-async-handler';

// Create productType
const createType = asyncHandler(async (req, res) => {
  const n = v4();

  const type = await ProductType.create({title:'new type' + n.toString().substring(0, 3)});

  res.status(200).json({
    message: 'Product type created',
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
    types: all,
  });
});

export {
  createType,
  updateType,
  deleteType,
  getType,
  getAllType,
};