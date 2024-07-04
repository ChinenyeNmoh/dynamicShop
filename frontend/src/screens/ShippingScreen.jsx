import { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { useCreateShippingMutation, useGetShippingQuery } from '../slices/shippingApiSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, isLoading: isShippingLoading, error: shippingError } = useGetShippingQuery();

  const [recipientName, setRecipientName] = useState('');
  const [recipientMobile, setRecipientMobile] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    if (data) {
      const { recipientName, recipientMobile, city, street, landmark, state, country } = data.address;
      setRecipientName(recipientName);
      setRecipientMobile(recipientMobile);
      setCity(city);
      setStreet(street);
      setLandmark(landmark);
      setState(state);
      setCountry(country);

      dispatch(saveShippingAddress(data.address));
    }
  }, [data, dispatch]);

  const [shipping, { isLoading, error }] = useCreateShippingMutation();

  useEffect(() => {
    if (error) {
      const errorMessage = error?.data?.message || error.error || 'Something went wrong';
      toast.error(errorMessage);
    }
  }, [error]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await shipping({
        recipientName,
        recipientMobile,
        city,
        street,
        landmark,
        state,
        country,
      }).unwrap();
      toast.success(res.message);
      dispatch(saveShippingAddress({
        recipientName,
        recipientMobile,
        city,
        street,
        landmark,
        state,
        country,
      }));
      navigate('/payment');
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error || 'Something went wrong, try again later');
    }
  };

  if (isShippingLoading) return <Loader />;

  return (
    <FormContainer>
      {isLoading && <Loader />}
      <CheckoutSteps step1 step2 />
      <hr />
      <h2 className="text-center mt-3">Shipping</h2>
      
      <Form className="m-3" onSubmit={submitHandler}>
        <Row>
          <Col md={6} sm={12}>
            <Form.Group className='my-2' controlId='recipientName'>
              <Form.Label className='fw-bold'>Recipient Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Name'
                value={recipientName}
                required
                onChange={(e) => setRecipientName(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={6} sm={12}>
            <Form.Group className='my-2' controlId='recipientMobile'>
              <Form.Label className='fw-bold'>Recipient Phone Number</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter Phone Number'
                value={recipientMobile}
                required
                onChange={(e) => setRecipientMobile(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group className='my-2' controlId='street'>
              <Form.Label className='fw-bold'>Street</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter street'
                value={street}
                required
                onChange={(e) => setStreet(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={6} sm={12}>
            <Form.Group className='my-2' controlId='city'>
              <Form.Label className='fw-bold'>City</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter city'
                value={city}
                required
                onChange={(e) => setCity(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={6} sm={12}>
            <Form.Group className='my-2' controlId='state'>
              <Form.Label className='fw-bold'>State</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter state'
                value={state}
                required
                onChange={(e) => setState(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={6} sm={12}>
            <Form.Group className='my-2' controlId='landmark'>
              <Form.Label className='fw-bold'>Landmark</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter landmark'
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={6} sm={12}>
            <Form.Group className='my-2' controlId='country'>
              <Form.Label className='fw-bold'>Country</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter country'
                value={country}
                required
                onChange={(e) => setCountry(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Button 
          type='submit' 
          variant='primary'
          className="d-block me-auto ms-auto mt-4"
          disabled={isLoading}
        >
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
