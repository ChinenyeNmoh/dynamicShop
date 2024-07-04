import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Image, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/userApiSlice';
import Loader from '../components/Loader';
import {  FaFacebook } from 'react-icons/fa';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import FormContainer from "../components/FormContainer"
import {jwtDecode} from 'jwt-decode';
import {  useGetCartMutation } from '../slices/cartApiSlice';
import { addToCart} from '../slices/cartSlice';

const LoginScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  //get cart when user logs in
  const [getCart, {  isLoading: isCartLoading,  isError: isCartError }] = useGetCartMutation();

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get('redirect') || '/';
  const token = searchParams.get('token');
  const message = searchParams.get('message');

  const { userInfo } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);


  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const user = decoded.user;
        dispatch(setCredentials({ user }));
        getCart().unwrap().then((res) => {
          dispatch(addToCart(res));
          navigate('/');
        }).catch((err) => {
          console.log(err);
          toast.error('Invalid token');
        });
      } catch (err) {
        console.log(err);
        toast.error('Invalid token');
      }
    }
  }, [token, dispatch, navigate, getCart]);

  useEffect(() => {
    if (message) {
      toast.info(message);
    }
  }, [message]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      //save user info to local storage
      dispatch(setCredentials({ ...res }));
      //get cart details to local storage
      try {
        const cartRes = await getCart().unwrap();
        dispatch(addToCart(cartRes));
      } catch (err) {
          console.log('Error fetching cart:', err);
      }
      
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'An error occurred during login');
    }
  };

  const facebookLoginHandler = (e) => {
    e.preventDefault();
    if (userInfo) {
      toast.info('You are already logged in');
      return;
    }
    window.location.href = 'http://localhost:5000/api/users/facebooklogin';
  };

  const googleLoginHandler = (e) => {
    e.preventDefault();
    if (userInfo) {
      toast.info('You are already logged in');
      return;
    }
    window.location.href = 'http://localhost:5000/api/users/googlelogin';
  };

  return (
    <>
      {(isLoginLoading || isCartLoading) && <Loader />}
      {isCartError && <p>Error loading cart</p>}
      <FormContainer>
        <h2 className="text-center mt-3">Sign In</h2>
        <Form className="m-3" onSubmit={submitHandler}>
          <Form.Group className="my-2" controlId="email">
            <Form.Label className='fw-bold'>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="my-2" controlId="password">
            <Form.Label className='fw-bold'>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button
            disabled={isLoginLoading}
            type="submit"
            variant="primary"
            className="d-block me-auto ms-auto mt-4"
          >
            Sign In
          </Button>
          <Button
            type="button"
            variant="light"
            className="d-block me-auto ms-auto mt-4 border rounded-pill"
            onClick={googleLoginHandler}
          >
            <Image src='/images/download.png' className='google me-1'></Image>
            Sign in with Google
          </Button>
          <Button
            type="button"
            variant="light"
            className="d-block me-auto ms-auto mt-4 border rounded-pill"
            onClick={facebookLoginHandler}
          >
            <FaFacebook className="text-primary me-1 fs-3" />
            Sign in with Facebook
          </Button>
        </Form>

        <Row className="py-3 m-3 ">
          <Col md={6}>
            New Customer?{' '}
            <Link to="/register">
              Register
            </Link>
          </Col>

          <Col md={6}>
            <Link to="/forgotpassword" className="text-muted">
              Forgot password?
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};

export default LoginScreen;