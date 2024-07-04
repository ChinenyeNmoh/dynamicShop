import Product from '../models/productModel.js';
import asyncHandler from "express-async-handler";


// Create new product
const createProduct = asyncHandler(async (req, res) => {
  const findProduct = await Product.findOne({ name: req.body.name });
  if (findProduct) {
    throw new Error(`${req.body.name} product already exists`);
  }

  const imagesArray = [{ url: req.body.images }];
  req.body.images = imagesArray;

  const newProduct = await Product.create(req.body);

  return res.json({
    message: `New product ${req.body?.name} created`,
    data: newProduct,
  });
});

  
// get a product
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate('ratings.postedby', 'local.email');
  
  if (product) {
    return res.status(200).json({
      product: product,
    });
  } else {
    res.status(404);
    throw new Error(`Product with id ${id} not found`);
  }
});
  
// get all products

const getAllProduct = asyncHandler(async (req, res) => {
  // Filtering
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields"];
  excludeFields.forEach((el) => delete queryObj[el]);

  // Convert to string and back to JSON
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  const query = Product.find(JSON.parse(queryStr));

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query.sort(sortBy);
  } else {
    query.sort("-createdAt");
  }

  // Limit fields
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query.select(fields);
  } else {
    query.select("-__v");
  }

  // Pagination
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  query.skip(skip).limit(limit);

  if (req.query.page) {
    const productCount = await Product.countDocuments();
    if (skip >= productCount) {
      res.status(404);
      throw new Error('Page not found');
    }
  }

  // Execute query
  const products = await query.exec();

  if (products && products.length > 0) {
    return res.status(200).json({
      products: products,
    });
  } else {
    res.status(404);
    throw new Error('Sorry, no product found');
  }
});


//search products
const searchProduct = asyncHandler(async (req, res) => {
  const { search } = req.query;
  console.log("Search query", search);
  if (!search) {
    res.status(400);
    throw new Error('Search query is required');
  }
  const products = await Product.find({
    $or: [
      { name: { $regex: search, $options: 'i' } },
      {description: { $regex: search, $options: 'i' } },
    ],
  });
  if(products && products.length > 0) {
    return res.status(200).json({
      products: products,
    });
  } else {
    res.status(404);
    throw new Error('Sorry, no product found');
  }
})


//update product
const updateProduct = asyncHandler(async (req, res) => {
  console.log("i was hit oh");
  const { id } = req.params;
  console.log(id);

  const findProduct = await Product.findById(id);
  console.log(findProduct);

  if (!findProduct) {
    res.status(404);
    throw new Error("Product not found");
  }

  req.body.productType = req.body.productType ? req.body.productType : findProduct.productType;
  req.body.category = req.body.category ? req.body.category : findProduct.category;
  req.body.name = req.body.name ? req.body.name : findProduct.name;
  req.body.price = req.body.price ? req.body.price : findProduct.price;
  req.body.description = req.body.description ? req.body.description : findProduct.description;
  req.body.quantity = req.body.quantity ? req.body.quantity : findProduct.quantity;
  req.body.images = req.body.images ? req.body.images : findProduct.images;
  req.body.discountedPrice = req.body.discountedPrice ? req.body.discountedPrice : findProduct.discountedPrice;

  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

  return res.status(200).json({
    message: "Product updated successfully",
    data: updatedProduct,
  });
});

  //delete a product
const deleteProduct = asyncHandler(async(req, res) => {
    const {id} = req.params;
      const product = await Product.findByIdAndDelete(id)
      if (product) {
        return res.status(200).json({
          message: `Product with id ${id} deleted successfully`,
          data: product,
        });
      } else {
        res.status(404).json
        throw new Error(`Product with id ${id} not found`);
      }
  })
  
  //ratings
  const productRating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, prodId, comment } = req.body;
  
    const product = await Product.findById(prodId);
    if (!product) {
      res.status(404);
      throw new Error(`Product with id ${prodId} not found`);
    }
  
    let rateProduct;
  
    let alreadyRated = product.ratings.find(userId => userId.postedby.toString() === _id.toString());
  
    if (alreadyRated) {
      const updatedProd = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        { new: true }
      );
  
      return res.status(200).json({
        status: "success",
        data: updatedProd,
      });
    } else {
      rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
  
      res.status(200).json({
        status: "success",
        data: rateProduct,
      });
    }
  
    const getallratings = await Product.findById(prodId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = ratingsum / totalRating;
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
  });
export { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct,searchProduct, productRating}
