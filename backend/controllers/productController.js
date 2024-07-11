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
  const { productType, category, sort, page = 1, limit = 10, sale } = req.query;
  let query = {};
  let sortBy = {};

  // Filtering
  if (productType) query.productType = productType;
  if (category) query.category = category;
  if (sale) {
    query.discountedPrice = { $gt: 0 };
  }

  // Sorting
  switch (sort) {
    case 'high':
      sortBy.price = -1;
      sortBy.discountedPrice = { $exists: true, $ne: null };
        sortBy.discountedPrice = -1;
        
        break;
    case 'low':
      sortBy.price = 1;
        sortBy.discountedPrice = { $exists: true, $ne: null };
        sortBy.discountedPrice = 1;
        
        break;
    case 'old':
      sortBy.createdAt = 1;
      break;
    case 'rating':
      sortBy.totalrating = -1;
      break;
    case 'alphabetical':
      sortBy.name = 1;
      break;
    default:
      sortBy.createdAt = -1; // Default sorting by newest
  }

  try {
   
    const products = await Product.find(query).sort(sortBy).populate('category productType');

    if (products && products.length > 0) {
      return res.status(200).json({
        message: 'Products retrieved',
        products
      });
    } else {
      return res.status(404).json({ message: 'Sorry, no product found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
