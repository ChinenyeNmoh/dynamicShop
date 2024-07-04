import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
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
import AllOrderScreen from './screens/AllOrdersScreen.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
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
      <Route path='/order' element={<OrderScreen />} />
      <Route path='/order/:id' element={<OrderDetailScreen />} />
      <Route path='/orders' element={<AllOrderScreen />} />
    </Route>
  </Route >
  

  )
)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)
