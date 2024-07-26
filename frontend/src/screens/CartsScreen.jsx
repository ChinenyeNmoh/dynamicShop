import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { addToCart, removeCart, emptyCart } from '../slices/cartSlice';
import { useCreateCartMutation, useDelItemMutation, useEmptyCartMutation, useApplyCouponMutation } from '../slices/cartApiSlice';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';



const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  const [ cartData, {isLoading: cartLoading, error: cartError} ] = useCreateCartMutation();
  const [ delItem ] = useDelItemMutation();
  const [ delCart ] = useEmptyCartMutation();
  const [ applyCoupon ] = useApplyCouponMutation();
  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingFee, totalAfterCoupon, totalPrice, taxFee, cartTotal } = cart;
  const [coupon, setCoupon] = useState()
 
  
  //if there is an error, show the error message
  useEffect(() => {
    if(cartError) {
      toast.error(cartError?.data?.message || cartError.error)
    }
  }, [cartError])


  const addToCartHandler = async (item, qty) => {
    try{
      const id = item.productId._id;
      const res = await cartData({qty, id}).unwrap();
      toast.success(res.message)
      dispatch(addToCart({...res} ));
    }catch(err){
      toast.error(err?.message || err.error);
    }
    
  };

  const removeFromCartHandler = async (id) => {
    console.log(id)
    const res = await delItem(id).unwrap();
    console.log(res)
    dispatch(removeCart({cart:res.cart}));
    toast.success(res.message);
  };

  const deleteCartHandler = async () => {
    console.log('delete cart handler')
    const res = await delCart().unwrap();
    console.log(res)
    dispatch(emptyCart());
    toast.success(res.message);
    navigate('/');
  }

  const checkoutHandler = () => {
    // If user is not logged in, redirect to login page
    navigate('/login?redirect=/shipping');
  };

  const submitHandler = async(e) => {
    try{
      e.preventDefault();
      const res = await applyCoupon({coupon}).unwrap();
      console.log(res)
      dispatch(addToCart({...res}));
      toast.success(res.message)
  }catch(err){
    console.log(err)
    toast.error(err.data?.error || "something went wrong");
  }
}

  return (
    <>
    {cartLoading && <Loader />}
   
    <Row>
      
      <Col md={8}>
        <h1 style={{ marginBottom: '20px' }}>Shopping Cart</h1>
        {cartItems?.length === 0? (
          <h6>
            Your cart is empty <Link to='/'>Go Back</Link>
          </h6>
        ) : (
          <ListGroup variant='flush'>
            {cartItems?.map((item) => (
              
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.productId.images[0].url} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/products/${item.productId._id}`}>{item.productId.name}</Link>
                  </Col>
                  <Col md={2}>N{item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as='select'
                      value={item.quantity}
                      onChange={(e) => {
                        addToCartHandler(item, Number(e.target.value))
                      }}
                    >
                      {[...Array(item.productId.quantity).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromCartHandler(item.productId._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      {cartItems?.length > 0 && (
        <Col md={4}>
          <Card className='cart'>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h4 className='text-success'>
                  Payment Total for ({cartItems.reduce((acc, item) => acc + Number(item.quantity), 0)}) items
                </h4>
                <hr />
                <Row>
                  <Col md={6}>
                    <p className='fw-bold'>Items Price:</p>
                  </Col>
                  <Col md={6}>
                    N{cartTotal}
                  </Col>
                  {totalAfterCoupon > 0 && (
                    <>
                      <Col md={6}>
                        <p className='fw-bold'>Total After Coupon:</p>
                      </Col>
                      <Col md={6}>
                        N{totalAfterCoupon}
                      </Col>
                    </>
                  )}
                  <Col md={6}>
                    <p className='fw-bold'>Shipping Price:</p>
                  </Col>
                  <Col md={6}>
                    N{shippingFee}
                  </Col>
                  <Col md={6}>
                    <p className='fw-bold'>Tax Price:</p>
                  </Col>
                  <Col md={6}>
                    N{taxFee}
                  </Col>
                  <Col md={6}>
                    <p className='fw-bold'>Total Price:</p>
                  </Col>
                  <Col md={6}>
                    N{totalPrice}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className='d-flex justify-content-between'>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cartItems?.length === 0}
                  onClick={() => checkoutHandler()}

                >
                  Checkout
                </Button>
                <Button
                  type='button'
                  className='btn-block bg-danger btn-outline-danger text-white'
                  onClick={() => deleteCartHandler()}
                >
                  Empty Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
      <Card className='mt-3'>
       <Form className="m-3" onSubmit={submitHandler}>
       <p className='text-success fw-bold'> Get a discount on your purchase.</p> 
         <Form.Group className="my-2" controlId="coupon">
           <Form.Label>Coupon</Form.Label>
           <Form.Control
             type="text"
             placeholder="Enter coupon"
             value={coupon}
             onChange={(e) => setCoupon(e.target.value)}
           />
         </Form.Group>
         <Button
           type="submit"
           variant="primary"
           className="d-block me-auto ms-auto mt-4"
         >
          Apply
         </Button>
       </Form>
      
      </Card>
      
        </Col>
      )}
      
    </Row>
    
      
    </>
  );
};

export default CartScreen;
