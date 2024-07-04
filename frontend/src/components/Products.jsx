import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart } from '../slices/cartSlice';
import { addToWish } from '../slices/wishListSlice';
import { useCreateCartMutation } from '../slices/cartApiSlice';
import { useEffect } from 'react';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const [cartData, { isLoading: cartLoading, error: cartError }] = useCreateCartMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (cartError) {
      toast.error(cartError?.data?.message || cartError.error);
    }
  }, [cartError]);

  const addToCartHandler = async (product, qty) => {
    try {
      const id = product._id;
      const res = await cartData({ id, qty }).unwrap();
      toast.success(res.message);
      dispatch(addToCart({ cart: res.cart }));
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const addToWishHandler = (product) => {
    dispatch(addToWish(product));
    toast.success('Item added to wishlist');
  };

  return (
    <Card className='my-3 p-3 rounded'>
      {cartLoading && <Loader />}
      <Link to={`/products/${product._id}`}>
        <Card.Img src={product.images[0].url} variant='top' />
      </Link>
      <Card.Body>
        <Link to={`/products/${product._id}`} className="text-decoration-none">
          <Card.Title as='div' className='product-title'>
            <strong className='text-center mb-0'>{product.name}</strong>
          </Card.Title>
        </Link>
        <hr />
        {product.quantity === 0 ? (
          <div>
            {product.discountedPrice > 0 ? (
              <Card.Text as='h5' className='text-decoration-line-through'>
                N{product.discountedPrice} <span className='text-danger'>sold</span>
              </Card.Text>
            ) : (
              <Card.Text as='h5' className='text-decoration-line-through'>
                N{product.price} <span className='text-danger'>sold</span>
              </Card.Text>
            )}
          </div>
        ) : (
          <>
            {product.discountedPrice > 0 ? (
              <Card.Text as='p'>
                <span className='text-muted text-decoration-line-through'>Original Price: N{product.price}</span><br />
                <span className='fw-bold'>Discounted Price: ${product.discountedPrice}</span>
              </Card.Text>
            ) : (
              <Card.Text as='h5'>
                N{product.price}
              </Card.Text>
            )}
          </>
        )}
        <Card.Text as='div'>
          <Rating value={product.totalrating} text={`${product.totalrating} reviews`} />
        </Card.Text>
        <Card.Text as='div' className='text-dark'>
          <Button
            variant='link'
            onClick={() => addToWishHandler(product)}
            className='text-dark text-decoration-none'
          >
            <FaHeart /> Wishlist
          </Button>
          <Button
            variant='link'
            onClick={() => addToCartHandler(product, 1)}
            className='text-dark text-decoration-none'
            disabled={product.quantity === 0}
          >
            <FaShoppingCart /> Cart
          </Button>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
