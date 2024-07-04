import { useState} from 'react';
import { Form, Button } from 'react-bootstrap';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import FormContainer from "../components/FormContainer"
import { useForgotPasswdMutation } from '../slices/userApiSlice';
import { useNavigate } from 'react-router-dom';

const ForgotPasswdScreen = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [forgot, { isLoading }] = useForgotPasswdMutation();
  const navigate = useNavigate();

  
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
        if (!email) {
          setEmailError(true);
        }
      const res = await forgot({ email }).unwrap();
      toast.success(res.message);
      navigate('/')
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'An error occurred during login');
    }
  };  

  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError(false);
    }
  };
  return (
    <>
      {isLoading && <Loader />}
      <FormContainer>
       
          <h2 className="text-center mt-3">Forgot Password</h2>

          <Form className="m-3" onSubmit={submitHandler}>
            <Form.Group className="my-2" controlId="email">
               
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={emailChangeHandler}
              />
               <Form.Text className={`text-danger ${emailError ? 'd-block' : 'd-none'}`}> Email is required</Form.Text>
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

export default ForgotPasswdScreen;
