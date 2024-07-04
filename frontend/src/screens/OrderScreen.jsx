import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Card, Form, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/orderApiSlice';
import { emptyCart } from '../slices/cartSlice';

const OrderScreen = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { userInfo} = useSelector((state) => state.auth);

  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cardName, setCardName] = useState('');

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }else if(!userInfo){
        navigate('/login?redirect=order');
    }
  }, [cart.paymentMethod, cart.shippingAddress, userInfo, navigate]);

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        cardNumber,
        cvv,
        expiryDate,
        cardName,
      }).unwrap();
      console.log('Order:', res);
      dispatch(emptyCart());
      toast.success(res.message);
      navigate(`/order/${res.order._id}`);
    } catch (err) {
        console.log('Error:', err);
      toast.error(err);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={7}>
          <ListGroup variant='flush'>
            <ListGroup.Item className='mb-4'>
              <h3 className='text-success'>Shipping Details</h3>
              <strong className=' pt-5 pb-5'>Recipient Name: </strong> {cart.shippingAddress.recipientName}<br/>
              <strong className='pt-5 pb-5'>Recipient Phone Number: </strong> {cart.shippingAddress.recipientMobile}
              <p >
                <strong className='pt-5 pb-5'>Address:</strong>
                {' '}
                {cart.shippingAddress.street}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.state},{' '}
                {cart.shippingAddress.landmark}{' '}{cart.shippingAddress.country}.
              </p>
            </ListGroup.Item>

            <ListGroup.Item className='mb-4'>
  <h3 className='text-success'>Billing Details</h3>
  <strong>Name: </strong>
  {userInfo.user.local ? (
    <>
      {userInfo.user.local.firstname} {userInfo.user.local.lastname}<br />
      <strong>Phone No: </strong> {userInfo.user.local.mobile}
      <br />
      <strong>Address: </strong> {userInfo.user.local.address} <br />
      <strong>Email: </strong> {userInfo.user.local.email}
    </>
  ) : userInfo.user.facebook ? (
    <>
      {userInfo.user.facebook.firstname} {userInfo.user.facebook.lastname} <br />
      <strong>Email: </strong> {userInfo.user.local.email}
    </>
  ) : (
    <>
      {userInfo.user.google.firstname} {userInfo.user.google.lastname} <b>
      <strong>Email: </strong> {userInfo.user.local.email}
      </b>
    </>
  )}
  <br />
</ListGroup.Item>
            <ListGroup.Item className='mb-4'>
            <h3 className='text-success '>Order Items</h3>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item?.productId.images[0].url}
                            alt={item.productId.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/products/${item.productId._id}`}>
                            {item.productId.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.quantity} x ${item.price} = $
                          {(item.quantity * (item.price * 100)) / 100}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
            <ListGroup.Item >
            <h3 className='text-success'>Payment Method</h3>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

          </ListGroup>
        </Col>
        <Col md={5}>
          <Card className='mb-3'>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2 className='text-center text-success'>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col className='fw-bold'>Item Prices</Col>
                  <Col>${cart.cartTotal}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col className='fw-bold'>Shipping Fee</Col>
                  <Col>${cart.shippingFee}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col className='fw-bold'>Tax Fee</Col>
                  <Col>${cart.taxFee}</Col>
                </Row>
              </ListGroup.Item>
              {cart.totalAfterCoupon > 0 && (
                <Row>
                  <Col className='fw-bold ms-3'>TotalAfterCoupon</Col>
                  <Col>${cart.totalAfterCoupon}</Col>
                </Row>
              )}
              <ListGroup.Item>
                <Row>
                  <Col className='fw-bold'>Total</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && (
                  <Message variant='danger'>{error.data.message}</Message>
                )}
              </ListGroup.Item>
              {cart.paymentMethod === 'cashOnDelivery' && (<ListGroup.Item>
                
                <Button
                  type='button'
                  className='btn-block d-block ms-auto me-auto '
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>)}
            </ListGroup>
          </Card>
          {cart.paymentMethod === 'flutterwave' && (<Row>
            <Col>
             <Card>
                <Form className='m-3'>
                    <h3 className='ms-2 mt-3 text-success'>
                        Payment Card
                        <Image src='/images/visa.png' className=' ms-5'></Image>
                        <Image src='/images/mastercard.png' ></Image>
                    </h3>
                <Form.Group controlId='cardNumber' className='mb-3'>
                  <Form.Label className='fw-bold'>Card Number</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Card Number'
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  ></Form.Control>
                  </Form.Group>
                  <Row>
                  <Col md={6}>
                  <Form.Group controlId='cvv' className='mb-3'>
                    <Form.Label className='fw-bold'>CVV/CVC</Form.Label>
                    <Form.Control
                    type='text'
                    placeholder='Enter CVV/CVC'
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  </Col>
                  <Col md={6}>
                  <Form.Group controlId='expiryDate' className='mb-3'>
                    <Form.Label className='fw-bold'>Expiry Date</Form.Label>
                    <Form.Control
                    type='text'
                    placeholder='Enter Expiry Date'
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  </Col>
                  </Row>
                  <Form.Group controlId='cardName' className='mb-3'>
                    <Form.Label className='fw-bold'>Card Holder Name</Form.Label>
                    <Form.Control
                    type='text'
                    placeholder='Enter Card Holder Name'
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block d-block ms-auto me-auto '
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
                </Form>
             </Card>
            </Col>
            </Row>)}
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;