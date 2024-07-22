import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { HelmetProvider } from 'react-helmet-async';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './styles/bootstrap.custom.css';
import './styles/index.css';
import HomeScreen from './screens/HomeScreen';
import AllHomeProductScreen from './screens/AllHomeProductScreen.jsx';
import ProductScreen from './screens/ProductScreen';
import NotFoundScreen from "./screens/NotFoundScreen.jsx"
import { Provider } from 'react-redux';
import store from './store.js';
import CartScreen from './screens/CartsScreen.jsx';
import WishScreen from './screens/WishScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import ForgotPasswdScreen from './screens/ForgotPasswdScreen.jsx';
import UpdatePasswdScreen from './screens/UpdatePasswdScreen.jsx';
import ShippingScreen from './screens/ShippingScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import PaymentScreen from './screens/PaymentScreen.jsx';
import OrderScreen from './screens/OrderScreen.jsx';
import OrderDetailScreen from './screens/OrderDetailScreen.jsx';
import AllOrderScreen from './screens/Admin/AllOrdersScreen.jsx';
import {PayPalScriptProvider} from '@paypal/react-paypal-js';
import ProfileScreen from './screens/ProfileScreen.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import AllUsersScreen from './screens/Admin/AllUsersScreen.jsx';
import UpdateUserScreen from './screens/Admin/UpdateUserScreen.jsx';
import CategoryScreen from './screens/Admin/CategoryScreen.jsx';
import ProductTypeScreen from './screens/Admin/ProductTypeScreen.jsx';
import CouponScreen from './screens/Admin/CouponsScreen.jsx';
import AllEnquiriesScreen from './screens/Admin/AllEnquiresScreen.jsx';
import AllProductsScreen from './screens/Admin/AllProductsScreen.jsx';
import UpdateProductScreen from './screens/Admin/updateProductScreen.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/' element={<HomeScreen />} />
      <Route index={true} path='/allproducts' element={< AllHomeProductScreen  />} />
      <Route path='/allproducts/:page' element={< AllHomeProductScreen  />} />
      <Route path='/allproducts/:keyword' element={< AllHomeProductScreen  />} />
      <Route path='/allproducts/:keyword/:page' element={< AllHomeProductScreen  />} />
      <Route path='/products/:id' element={<ProductScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='/forgotpassword' element={<ForgotPasswdScreen />} />
      <Route path='/update/' element={<UpdatePasswdScreen />} />
      <Route path='*' element={<NotFoundScreen />} />
    
      {/* Protected route. you have to be logged in to access them */}
      <Route path="" element={<PrivateRoute />} >
      <Route path='/cart' element={<CartScreen />} />
      <Route path='/wishlist' element={<WishScreen />} />
      <Route path='/shipping' element={<ShippingScreen />} />
      <Route path='/payment' element={<PaymentScreen />} />
      <Route path='/profile' element={<ProfileScreen />} />
      <Route path='/order' element={<OrderScreen />} />
      <Route path='/order/:id' element={<OrderDetailScreen />} />
      
    </Route>

    {/* Admin route. you have to be logged in as admin to access them */}
    <Route path='' element={<AdminRoute/>}>
    <Route path='/admin/orders' element={<AllOrderScreen />} />
    <Route path='/admin/orders/:page' element={<AllOrderScreen />} />
    <Route path='/admin/orders/:keyword' element={<AllOrderScreen />} />
    <Route path='/admin/orders/:keyword/:page' element={<AllOrderScreen />} />
    <Route path='/admin/users' element={<AllUsersScreen />} />
    <Route path='/admin/users/:page' element={<AllUsersScreen />} />
    <Route path='/admin/users/:keyword' element={<AllUsersScreen />} />
    <Route path='/admin/users/:keyword/:page' element={<AllUsersScreen />} />
    <Route path='/admin/user/:id/edit' element={<UpdateUserScreen />} />
    <Route path='/admin/categories' element={<CategoryScreen />} />
    <Route path='/admin/types' element={<ProductTypeScreen />} />
    <Route path='/admin/coupons' element={<CouponScreen />} />
    <Route path='/admin/enquires' element={<AllEnquiriesScreen />} />
    <Route path='/admin/enquires/:page' element={<AllEnquiriesScreen />} />
    <Route path='/admin/enquires/:keyword' element={<AllEnquiriesScreen />} />
    <Route path='/admin/enquires/:keyword/:page' element={<AllEnquiriesScreen />} />
    <Route path='/admin/products' element={<AllProductsScreen />} />
    <Route path='/admin/products/:page' element={<AllProductsScreen />} />
    <Route path='/admin/products/:keyword' element={<AllProductsScreen />} />
    <Route path='/admin/products/:keyword/:page' element={<AllProductsScreen />} />
    <Route path="/admin/product/:id/edit" element={<UpdateProductScreen />} />
    </Route>
  </Route >

  )
)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* HelmetProvider is used to manage SEO metadata */}
    <HelmetProvider>
    <Provider store={store}>
    <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
    </HelmetProvider>
  </React.StrictMode>
)
