
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const Flash = ({ error='', data='', message='Success' }) => {
  useEffect(() => {
    if (error) {
      toast.error(error);
    } else if (data) {
      toast.success(message);
    }else if(message !== 'Success'){
      toast.success(message);
    }
  }, [error, data, message]);

  return null; // Ensure the component returns null if no JSX is needed
};

export default Flash;

/*
alternative code is to use bootstrap alert
import { Alert } from 'react-bootstrap';

const Message = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

Message.defaultProps = {
  variant: 'info',
};

export default Message; */
