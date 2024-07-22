import Product from '../models/productModel.js';
import asyncHandler from "express-async-handler";
import { v4 as uuidv4, v4 } from 'uuid';
import { Types } from 'mongoose';



// Create new product
// Create new product
const createProduct = asyncHandler(async (req, res) => {
  try {
    const n = uuidv4();
    const newProduct = {
      name: 'sample name' + n,
      description: 'sample description',
      price: 0,
      images: [{url:'sample image'}],
      quantity: 0,
      productType: new Types.ObjectId('60f1f1b3b3b3b3b3b3b3b3b3'),
  category: new Types.ObjectId('60f1f1b3b3b3b3b3b3b3b3b3'),
    };
    const product = await Product.create(newProduct);
    return res.json({
      message: 'New product created',
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
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
  const { productType, category, sort,  sale, keyword, wish, home } = req.query;
  let query = {};
  let sortBy = {};
  let products;
  let count;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;


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
    if(keyword){
      query = Product.find({
        $or: [
          {name: { $regex: keyword, $options: 'i' }},
          { description: { $regex: keyword, $options: 'i' } },
        ],
      });
    }
    if (wish){
      console.log('All products will be returned without pagination')
      products = await Product.find({})
    .sort(sortBy)
    .populate('category productType');
    count = products.length;
    }else if(home) {
      products = await Product.find({}).sort({createdAt: -1}).limit(12).populate('category productType');
      count = products.length;
    }else{
      count = await Product.countDocuments(query);
      products = await Product.find(query)
      .sort(sortBy)
      .limit(limit)
      .skip(limit * (page - 1))
      .populate('category productType');
    }
   
    if (products && count > 0) {
      return res.status(200).json({
        message: 'Products retrieved',
        products,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        totalCount: count,
      });
    } else {
      return res.status(404).json({ message: 'Sorry, no product found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});



//update product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const findProduct = await Product.findById(id);

  if (!findProduct) {
    res.status(404);
    throw new Error("Product not found");
  }

  const nameExist = await Product.findOne({ name: req.body.name });
  if (nameExist && nameExist._id.toString() !== id) {
    res.status(400);
    throw new Error(`Product with name ${req.body.name} already exists`);
  }
  req.body.productType = req.body.productType ? req.body.productType : findProduct.productType;
  req.body.category = req.body.category ? req.body.category : findProduct.category;
  req.body.name = req.body.name ? req.body.name : findProduct.name;
  req.body.price = req.body.price ? req.body.price : findProduct.price;
  req.body.description = req.body.description ?  req.body.description :  findProduct.description;
  req.body.quantity = req.body.quantity ? req.body.quantity : findProduct.quantity;
  req.body.images = req.body.images ? [{url:req.body.images}] : findProduct.images;
  req.body.discountedPrice = req.body.discountedPrice ? req.body.discountedPrice : findProduct.discountedPrice;

  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

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
          message: 'Product  deleted successfully',
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
    console.log(req.body);
  
    const product = await Product.findById(prodId);
    if (!product) {
      res.status(404);
      throw new Error(`Product with id ${prodId} not found`);
    }
  
    let rateProduct;
  
    let alreadyRated = product.ratings.find(userId => userId.postedby.toString() === _id.toString());
    console.log(alreadyRated);
  
    if (alreadyRated) {
      alreadyRated.star = star;
      alreadyRated.comment = comment;
      alreadyRated.dateCreated = new Date();
      await product.save();
      return res.status(200).json({
        message: "review added",
        rating: product,
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
        message: "review added",
        rating: rateProduct,
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
export { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct, productRating}
