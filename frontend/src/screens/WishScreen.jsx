import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import { useCreateCartMutation } from '../slices/cartApiSlice';
import { useEffect } from 'react';
import Loader from '../components/Loader';
import { useGetProductsQuery } from '../slices/productSlice';
import { useRemoveWishMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';

const WishScreen = () => {
  const dispatch = useDispatch();

  

  const [cartData, { isLoading: cartLoading, error: cartError }] = useCreateCartMutation();
  const [delWish, { error: wishError }] = useRemoveWishMutation();
  const { data, isLoading, error } = useGetProductsQuery({});
  const products = data?.products || [];
  const wishItems  = useSelector((state) => state.auth.userInfo?.user.wishlist);

  useEffect(() => {
    if (cartError || wishError) {
      toast.error(cartError?.data?.message || cartError?.error || wishError?.data?.message || wishError?.error);
    }
  }, [cartError, wishError]);

  const addToCartHandler = async (item) => {
    try {
      const id = item._id;
      const res = await cartData({ id, qty: 1 }).unwrap();
      toast.success(res.message);
      dispatch(addToCart({ ...res, qty: 1 }));
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const removeFromWishHandler = async (id) => {
    try {
      const res = await delWish({ productId: id }).unwrap();
      console.log(res);
      dispatch(setCredentials({ ...res }));
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div>
      {cartLoading && <Loader />}
      <h1 style={{ marginBottom: '20px' }}>WishList</h1>
      {wishItems?.length === 0 ? (
        <h5>
          Your wishlist is empty <Link to='/'>Go Back</Link>
        </h5>
      ) : (
        <Row>
          {wishItems.map((item) => (
            <Col key={item._id} md={3} className="my-3">
              <Card className="p-3 rounded">
                <Link to={`/products/${item._id}`}>
                  <Card.Img src={item.images[0].url} variant='top' />
                </Link>
                <Card.Body>
                  <hr />
                  <Card.Title as='h6' className='product-title'>
                    <span className='fw-bold me-1'>Name:</span>
                    <strong className='text-center mb-0'>{item.name}</strong>
                  </Card.Title>
                  {products.some((product) => product._id === item._id && product.quantity === 0) ? (
                    <div>
                      {products.some((product) => product._id === item._id && product.discountedPrice > 0) ? (
                        <Card.Text as='h5' className='text-decoration-line-through'>
                          ${products.find((product) => product._id === item._id).discountedPrice} <span className='text-danger'>sold</span>
                        </Card.Text>
                      ) : (
                        <Card.Text as='h5' className='text-decoration-line-through'>
                          ${products.find((product) => product._id === item._id).price} <span className='text-danger'>sold</span>
                        </Card.Text>
                      )}
                    </div>
                  ) : (
                    <>
                      {products.some((product) => product._id === item._id && product.discountedPrice > 0) ? (
                        <Card.Text as='p'>
                          <span className='text-muted text-decoration-line-through'>Price: ${products.find((product) => product._id === item._id).price}</span><br />
                          <span className='fw-bold'>Sales Price: ${products.find((product) => product._id === item._id).discountedPrice}</span>
                        </Card.Text>
                      ) : (
                        <Card.Text as='h5'>
                          ${products.find((product) => product._id === item._id)?.price}
                        </Card.Text>
                      )}
                    </>
                  )}
                  <div className='d-flex justify-content-between '>
                    <Button
                      className="text-danger btn btn-link text-decoration-none outline-light"
                      onClick={() => removeFromWishHandler(item._id)}
                    >
                      <FaHeart className='text-danger me-1' />
                      Remove
                    </Button>
                    <Button
                      variant='light'
                      className="btn btn-link text-decoration-none outline-light"
                      type="button"
                      disabled={products.some((product) => product._id === item._id && product.quantity === 0)}
                      onClick={() => addToCartHandler(item)}
                    >
                      <FaShoppingCart className='text-success me-1' />
                      Cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default WishScreen;
