import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';
import { v4 as uuidv4, v4 } from 'uuid';


// Create category
const createCategory = asyncHandler(async (req, res) => {
  const n = v4();
  const cat = await Category.create({title:'new category' + n.toString().substring(0, 3)});
  res.status(200).json({
    message: "Category created",
    data: cat,
  });
});

// Update category
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cat = await Category.findById(id);

  if (!cat) {
    res.status(404);
    throw new Error("Category not found");
  }

  const updatedCat = await Category.findByIdAndUpdate(id, req.body, { new: true });

  res.status(200).json({
    message: "Category updated successfully",
    data: updatedCat,
  });
});

// Delete category
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cat = await Category.findById(id);

  if (!cat) {
    res.status(404);
    throw new Error("Category not found");
  }

  await Category.findByIdAndDelete(id);

  res.status(200).json({
    message: "Category deleted successfully",
  });
});

// Get a category
const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cat = await Category.findById(id);

  if (!cat) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.status(200).json({
    message: "Success",
    data: cat,
  });
});

// Get all categories
const getAllCategory = asyncHandler(async (req, res) => {
  const all = await Category.find();

  if (!all || all.length === 0) {
    res.status(404);
    throw new Error("No Category found");
  }

  const counter = await Category.countDocuments();

  res.status(200).json({
    message: "Success",
    count: counter,
    categories: all,
  });
});

export  {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategory,
};
