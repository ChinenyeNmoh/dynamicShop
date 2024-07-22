import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/userApiSlice';
import { useGetOrdersQuery } from '../slices/orderApiSlice';
import { setCredentials } from '../slices/authSlice';

const ProfileScreen = () => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  const { data: orders, isLoading, error } = useGetOrdersQuery();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    if(userInfo){
        setFirstName(userInfo.user.local?.firstname || userInfo.user.google?.firstname || userInfo.user.facebook?.firstname);
        setLastName(userInfo.user.local?.lastname || userInfo.user.google?.lastname || userInfo.user.facebook?.lastname);
        setEmail(userInfo.user.local?.email || userInfo.user.google?.email || userInfo.user.facebook?.email);
        setMobile(userInfo.user.local?.mobile || '');
        setAddress(userInfo.user.address || '');
    }
  }, [userInfo]);

  const dispatch = useDispatch();
  const submitHandler = async (e) => {
    e.preventDefault();
      try {
        const res = await updateProfile({
          _id: userInfo.user._id,
          firstname,
          lastname,
          mobile,
          address,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success(res.message);
      } catch (err) {
        console.error(err);
        toast.error(err?.data?.message || err.error);
      }
  };

  return (
    <Row>
      <Col md={6} className='d-block me-auto ms-auto'>
        <h3 className='text-center text-success mt-3'>User Profile</h3>
        <Card>
        <Form className="m-3"  onSubmit={submitHandler}>
            <Row>
                <Col md={6}>
                <Form.Group className='my-2' controlId='firstname'>
            <Form.Label className='fw-bold'>First Name</Form.Label>
            <Form.Control
              type='name'
              placeholder='Enter first name'
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
            ></Form.Control>
          </Form.Group>
                </Col>
                <Col md={6}>
                <Form.Group className='my-2' controlId='lastname'>
            <Form.Label className='fw-bold'>Last Name</Form.Label>
            <Form.Control
              type='name'
              placeholder='Enter last name'
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
            ></Form.Control>
          </Form.Group>

                </Col>
                <Col md={6}>
                <Form.Group className='my-2' controlId='email'>
            <Form.Label className='fw-bold'>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={email}
              disabled={true}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
                </Col>
                {userInfo.user.local?.mobile? (<Col md={6}>
            <Form.Group className='my-2' controlId='mobile'>
            <Form.Label className='fw-bold'>Phone Number</Form.Label>
            <Form.Control
              type='number'
              placeholder='Enter phone number'
              value={mobile}
              disabled={true}
              onChange={(e) => setMobile(e.target.value)}
            ></Form.Control>
          </Form.Group>

                </Col>):(<Col md={6}>
            <Form.Group className='my-2' controlId='mobile'>
            <Form.Label className='fw-bold'>Phone Number</Form.Label>
            <Form.Control
              type='number'
              placeholder='Enter phone number'
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            ></Form.Control>
          </Form.Group>

                </Col>)}
            
            </Row>
          <Form.Group className='my-2' controlId='address'>
            <Form.Label className='fw-bold'>Address</Form.Label>
            <Form.Control
              type='text'
              placeholder='Address'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button 
          type='submit' 
          variant='primary'
          className="d-block me-auto ms-auto mt-4"
          >
            Update
          </Button>
        </Form>
        </Card>
      </Col>
      <Col md={12}>
      <h3 className='text-center text-success mt-5'>Order History</h3>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error?.data?.error || error.error}
          </Message>
        ) : (
            <Table striped bordered hover responsive className='table-sm'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>CUSTOMER</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.toString().substring(0,7)}</td>
                    <td>
                    {order.user.local ? (
        <>
          {order.user.local.firstname} {order.user.local.lastname}<br />
        </>
      ) : order.user.google ? (
        <>
          {order.user.google.firstname} {order.user.google.lastname}<br />
        </>
      ) : (
        <>
          {order.user.facebook.firstname} {order.user.facebook.lastname}
        </>
      )}
                        </td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>N{order.totalPrice}</td>
                    <td>
                      {order.paymentStatus === 'paid' ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>
                    <td>
                      {order.orderStatus === 'delivered' ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>
                    <td>
                      <Button
                        as={Link}
                        to={`/order/${order._id}`}
                        variant='primary'
                        className='btn-sm'
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;