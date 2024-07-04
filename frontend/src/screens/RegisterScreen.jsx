import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { useRegisterMutation } from '../slices/userApiSlice';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';
  

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);



  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setPassword('');
      setConfirmPassword('');
    } else {
      try {
        const res = await register({ firstname, lastname, mobile, address, email, password }).unwrap();
        console.log(res)
        toast.success(res.message);
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
        console.log(err)
      }
    }
  };

  return (
    
    <FormContainer>
        {isLoading && <Loader />}
      <h1 className="text-center mt-3">Register</h1>
      <Form className="m-3"  onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='firstname'>
          <Form.Label className='fw-bold'>First Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter first name'
            value={firstname}
            required
            onChange={(e) => setFirstname(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className='my-2' controlId='lastname'>
          <Form.Label className='fw-bold'>Last Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter last name'
            value={lastname}
            required
            onChange={(e) => setLastname(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Row>
            <Col md={6} sm={12}>
            <Form.Group className='my-2' controlId='email'>
          <Form.Label className='fw-bold'>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
            </Col>
            <Col md={6} sm={12}>
            <Form.Group className='my-2' controlId='mobile'>
          <Form.Label className='fw-bold'>Phone Number</Form.Label>
          <Form.Control
            type='tel'
            placeholder='Enter phone number'
            value={mobile}
            required
            onChange={(e) => setMobile(e.target.value)}
          ></Form.Control>
        </Form.Group>
          </Col>
          <Col md={6} sm={12}>
          <Form.Group className='my-2' controlId='password'>
          <Form.Label className='fw-bold'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
          </Col>
          <Col md={6} sm={12}>
          <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label className='fw-bold'>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

          
          </Col>

        </Row>
        
        <Form.Group className='my-2' controlId='address'>
          <Form.Label className='fw-bold'>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter address'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button
         disabled={isLoading} 
         type='submit' 
         variant='primary'
         className="d-block me-auto ms-auto mt-4"
       
         >
          Register
        </Button>

        
      </Form>

      <Row className='ms-3 mb-2'>
        <Col>
          Already have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
