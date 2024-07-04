import axios from 'axios';
import { useEffect, useState} from 'react';
import { Form, Button } from 'react-bootstrap';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import FormContainer from "../components/FormContainer"
import { useUpdatePasswdMutation} from '../slices/userApiSlice';
import { useLocation, useNavigate } from 'react-router-dom';

const UpdatePasswdScreen = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { search } = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(search);
  const message = searchParams.get('message');
  const err = searchParams.get('err');
  const id = searchParams.get('id');
  const [updatePasswd, {isLoading, error}] = useUpdatePasswdMutation();

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
  }, [message]);

  useEffect(() => {
    if (err) {
      toast.error(err);
    }
  }, [err]);
  
  useEffect(() => {
    if (error) {
      // Display the error message returned by the mutation
      const errorMessage = error?.data?.message || error.error || 'Something went wrong';
      toast.error(errorMessage);
    }
  }, [error]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        setConfirmPassword('');
        setPassword('');
      } else {
        const res= await updatePasswd({id, password, confirmPassword}).unwrap();
        console.log(res)
        toast.success('Password updated successfully');
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <>
      
      <FormContainer>
       {isLoading && <Loader />}
          <h2 className="text-center mt-3">Update Password</h2>

          <Form className="m-3" onSubmit={submitHandler}>
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
               
            
            <Button
              disabled={isLoading}
              type="submit"
              variant="primary"
              className="d-block me-auto ms-auto mt-4"
            >
              Reset password
            </Button>
            
          </Form>
      
      </FormContainer>
    </>
  );
};

export default UpdatePasswdScreen;
