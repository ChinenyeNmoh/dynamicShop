import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { addToCart } from '../slices/cartSlice';
import { removeFromWish } from '../slices/wishListSlice';
import { toast } from 'react-toastify';
import { useCreateCartMutation } from '../slices/cartApiSlice';
import { useEffect } from 'react';
import Loader from '../components/Loader';

const WishScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wish = useSelector((state) => state.wish);
  const { wishItems } = wish;
  console.log("wishitems",wishItems);
  const [ cartData, {isLoading: cartLoading, error: cartError} ] = useCreateCartMutation();

  useEffect(() => {
    if(cartError) {
      toast.error(cartError?.data?.message)
    }
  }, [cartError])

  const addToCartHandler = async (item) => {
    try{
      const id = item._id;
      const res = await cartData({id, qty:1}).unwrap();
      console.log(res)
      toast.success(res.message)
      dispatch(addToCart({ ...res, qty: 1 }));

    }catch(err){
      toast.error(err?.message || err.error);
    }
  };

  const removeFromWishHandler = (id) => {
    dispatch(removeFromWish(id));
    toast.info('Item removed from wishlist');
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
          {wishItems?.map((item) => (
            <Col key={item._id} md={4} className="my-3">
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
                  {item.quantity === 0 ? (
          <div>
            {item.discountedPrice > 0 ? (
              <Card.Text as='h5' className='text-decoration-line-through'>
                ${item.discountedPrice} <span className='text-danger'>sold</span>
              </Card.Text>
            ) : (
              <Card.Text as='h5' className='text-decoration-line-through'>
                ${item.price} <span className='text-danger'>sold</span>
              </Card.Text>
            )}
          </div>
        ) : (
          <>
            {item.discountedPrice > 0 ? (
              <Card.Text as='p'>
                <span className='text-muted text-decoration-line-through'>Original Price: ${item.price}</span><br />
                <span className='fw-bold'>Discounted Price: ${item.discountedPrice}</span>
              </Card.Text>
            ) : (
              <Card.Text as='h5'>
                ${item.price}
              </Card.Text>
            )}
          </>
        )}
                  <div className='d-flex justify-content-between '>
                    <Button
                      className=" text-danger btn btn-link text-decoration-none"
                      onClick={() => removeFromWishHandler(item._id)}
                    >
                      <FaHeart className='text-danger me-1' />
                      Remove
                    </Button>
                    <Button
                      className="text-success btn btn-link text-decoration-none"
                      type="button"
                      disabled={item.quantity === 0}
                      onClick={() => addToCartHandler(item)}
                    >
                      <FaShoppingCart className='text-success me-1' />
                      Add To Cart
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
