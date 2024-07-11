import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {toast} from 'react-toastify';

//Outlet is the route we want to protect. If the user is logged in, we will render the Outlet, 
//otherwise we will redirect(navigate) the user to the login page.
//replace is to overwrite previous history entry

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth );
  if(userInfo && userInfo.user.role === 'admin') {
    return  <Outlet />
  }else{
    toast.error("Login to access this page")
    return <Navigate to='/login' replace />;
  }
};
export default AdminRoute;