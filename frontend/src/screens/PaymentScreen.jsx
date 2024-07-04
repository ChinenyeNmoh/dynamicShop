import { useState, useEffect } from 'react';
import { Form, Button, Col, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';
import { useUpdateCartMutation } from '../slices/cartApiSlice';
import { toast } from 'react-toastify';


const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const defaultPaymentMethod = cart.paymentMethod;

  useEffect(() => {
    if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState('cashOnDelivery');
  const [updateCart] = useUpdateCartMutation();

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log('Payment method:', paymentMethod);
    const res = await updateCart({ paymentMethod }).unwrap();
    dispatch(savePaymentMethod(res.cart.paymentMethod));
    toast.success(res.message);
    navigate('/order');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <hr />
      <h2 className="text-center mt-3">Payment Method</h2>
      <Form onSubmit={submitHandler} className="m-3" >
        <Form.Group>
          <Form.Label as='legend' className='fst-italic'>Select Method</Form.Label>
          <Col>
            <Form.Check
            className='mt-5'
              type='radio'
              label={<div className="d-flex text-primary fw-bold align-items-center border p-2 m-2 mt-0">Cash On Delivery</div>}
              id='cashOnDelivery'
              name='paymentMethod'
              value='cashOnDelivery'
              defaultChecked={defaultPaymentMethod === 'cashOnDelivery'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <Form.Check
              className='mt-4'
              type='radio'
              id='PayPal'
              name='paymentMethod'
              defaultChecked={defaultPaymentMethod === 'paypal'}
              label={<Image src="/images/paypal.jpg" className='m-2 mt-0'/>}
              value='paypal'
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
            </Form.Check>
            <Form.Check
              className='mt-4'
              type='radio'
              label={<Image src="/images/flutterwave.png" className='m-2 mt-0'/>}
              id='flutterwave'
              name='paymentMethod'
              value='flutterwave'
              defaultChecked={defaultPaymentMethod === 'flutterwave'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
                
            </Form.Check>
          </Col>
        </Form.Group>

        <Button 
        type='submit' 
        variant='primary'
        className="d-block me-auto ms-auto mt-4"
        >
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
