import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart } from '../slices/cartSlice';
import { useCreateCartMutation } from '../slices/cartApiSlice';
import { useAddWishMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useEffect } from 'react';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';


const Product = ({ product }) => {
  const dispatch = useDispatch();
  const [createCart, { isLoading: cartLoading, error: cartError }] = useCreateCartMutation();
  const [addWish, { isLoading: wishLoading, error: wishError }] = useAddWishMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (cartError || wishError) {
      toast.error(cartError?.data?.message || cartError?.error || wishError?.data?.message || wishError?.error);
    }
  }, [cartError, wishError]);

  const addToCartHandler = async (product, qty) => {
    try {
      const id = product._id;
      const res = await createCart({ id, qty }).unwrap();
      toast.success(res.message);
      dispatch(addToCart({ cart: res.cart }));
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const addToWishHandler = async (product) => {
    try {
      const res = await addWish({ productId: product._id }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Card className='my-3 px-3 pt-3 rounded fixed-height-card'>
      {(cartLoading || wishLoading) && <Loader />}
      <Link to={`/products/${product._id}`}>
        <Card.Img src={product.images[0].url} variant='top' className='card-img-top' />
      </Link>
      <Card.Body className='card-body'>
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
                <span className='text-muted text-decoration-line-through'>Price: N{product.price}</span><br />
                <span className='fw-bold'> ${product.discountedPrice}</span>
              </Card.Text>
            ) : (
              <Card.Text as='h5'>
                N{product.price}
              </Card.Text>
            )}
          </>
        )}
        
        <Card.Text as='div' className='text-dark'>
          <Button
            variant='link'
            onClick={() => addToWishHandler(product)}
            className='text-dark text-decoration-none ms-2'
          >
            <FaHeart />
          </Button>
          <Button
            variant='link'
            onClick={() => addToCartHandler(product, 1)}
            className='text-dark text-decoration-none ms-1 '
            disabled={product.quantity === 0}
          >
            <FaShoppingCart />
          </Button>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
