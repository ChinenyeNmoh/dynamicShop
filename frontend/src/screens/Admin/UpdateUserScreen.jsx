import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import {
  useUpdateUserMutation,
  useGetUserDetailsQuery,
} from '../../slices/userApiSlice';

const UpdateUserScreen = () => {
  const { id } = useParams();
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [address, setAddress] = useState('');

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(id);

  const user = data?.user;

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUser({
        id,
        role,
        isBlocked,
        isVerified,
      }).unwrap();
      toast.success(res.message);
      refetch();
      navigate('/admin/users');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (user) {
      setFirstName(user.local?.firstname || user.google?.firstname || user.facebook?.firstname || '');
      setLastName(user.local?.lastname || user.google?.lastname || user.facebook?.lastname || '');
      setEmail(user.local?.email || user.google?.email || user.facebook?.email || '');
      setMobile(user.local?.mobile || '');
      setAddress(user.address || '');
      setRole(user.role || '');
      setIsBlocked(user.isBlocked);
      setIsVerified(user.isVerified);
    }
  }, [user]);

  return (
    <>
      <Link to='/admin/users' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h3 className='text-center text-success mt-3'>Edit User</h3>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Form className="m-3"  onSubmit={submitHandler}>
            <Row>
            <Col md={6}>
            <Form.Group className='my-2' controlId='firstname'>
              <Form.Label className='fw-bold'>First Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter first name'
                value={firstname}
                disabled={true}
                onChange={(e) => setFirstName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            </Col>
            <Col md={6}>
            <Form.Group className='my-2' controlId='lastname'>
              <Form.Label className='fw-bold'>Last Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter last name'
                value={lastname}
                disabled={true}
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
            <Col md={6}>
            <Form.Group className='my-2' controlId='mobile'>
              <Form.Label className='fw-bold'>Mobile</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter mobile'
                value={mobile}
                disabled={true}
                onChange={(e) => setMobile(e.target.value)}
              ></Form.Control>
            </Form.Group>
            </Col>
            <Col md={4}>
            <Form.Group className='my-2' controlId='role'>
              <Form.Label className='fw-bold'>Role</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter role'
                value={role}
                onChange={(e) => setRole(e.target.value)}
              ></Form.Control>
            </Form.Group>
            </Col>
            <Col md={4}>
            <Form.Group className='my-2 fw-bold mt-5' controlId='isBlocked'>
              <Form.Check
                type='checkbox'
                label='Is Blocked'
                checked={isBlocked}
                onChange={(e) => setIsBlocked(e.target.checked)}
              ></Form.Check>
            </Form.Group>
            </Col>
            <Col md={4}>
            <Form.Group className='my-2 fw-bold mt-5' controlId='isVerified'>
              <Form.Check
                type='checkbox'
                label='Is Verified'
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
              ></Form.Check>
            </Form.Group>
            </Col>
            <Form.Group className='my-2' controlId='address'>
              <Form.Label className='fw-bold'>Address</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter address'
                value={address}
                disabled={true}
                onChange={(e) => setAddress(e.target.value)}
              ></Form.Control>
            </Form.Group>
            </Row>
            <Button
             type='submit' 
             variant='primary'
             className="d-block me-auto ms-auto mt-4"
             >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UpdateUserScreen;
