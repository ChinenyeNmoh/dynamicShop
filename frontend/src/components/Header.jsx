import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Badge } from 'react-bootstrap';
import { FaHeart, FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useLogoutMutation } from '../slices/userApiSlice';
import { deleteCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { resetCart } from '../slices/cartSlice';
import { useEffect } from 'react';
import { useGetProfileQuery } from '../slices/userApiSlice';
import { useGetCategoriesQuery } from '../slices/categoryApiSlice';
import { useGetTypesQuery } from '../slices/typeApiSlice';
import Loader from './Loader';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: userData, error } = useGetProfileQuery();
  const userinfo = userData?.user || {};
  const [logout, { isLoading }] = useLogoutMutation();
  
  const { data, isLoading: catLoading, refetch: refetchCategories } = useGetCategoriesQuery();
  const categories = data?.categories || [];
  const { data: typeData, refetch: refetchTypes } = useGetTypesQuery();
  const types = typeData?.types || [];

// lets put the fetching of categories and types in a useEffect hook
// so that it will be fetched when the component mounts and not when the component is rendered
useEffect(() => {
  refetchCategories();
  refetchTypes();
}, []);

  useEffect(() => {
    if (error?.data?.message === 'Log in to continue') {
      dispatch(deleteCredentials());
    }
  }, [error?.data?.message]);



  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(deleteCredentials());
      dispatch(resetCart());
      window.location.href = '/';
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <header>
      {isLoading && <Loader />}
      <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>DynamicShop</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className="m-auto gap-4">
              {/* All Dropdown */}
              <NavDropdown
                id="nav-dropdown-dark-all"
                title="All"
                menuVariant="dark"
                className="me-3"
              >
                <LinkContainer to="/">
                  <NavDropdown.Item>All Products</NavDropdown.Item>
                </LinkContainer>
                {types.map((type) => (
                  <LinkContainer
                    key={type._id}
                    to={{ pathname: '/', search: `productType=${type._id}` }}
                  >
                    <NavDropdown.Item>
                      All {type.title.charAt(0).toUpperCase() + type.title.slice(1)}
                    </NavDropdown.Item>
                  </LinkContainer>
                ))}
              </NavDropdown>

              {/* Boys Dropdown */}
              <NavDropdown
                id="nav-dropdown-dark-boys"
                title="Boys"
                menuVariant="dark"
                className="me-3"
              >
                {categories
                  .filter((cat) => cat.title === 'boys')
                  .map((cat) => (
                    <div key={cat._id}>
                      <LinkContainer to={{ pathname: '/', search: `category=${cat._id}` }}>
                        <NavDropdown.Item>All Boys</NavDropdown.Item>
                      </LinkContainer>
                      {types.map((type) => (
                        <LinkContainer
                          key={type._id}
                          to={{ pathname: '/', search: `category=${cat._id}&productType=${type._id}` }}
                        >
                          <NavDropdown.Item>
                            {type.title.charAt(0).toUpperCase() + type.title.slice(1)}
                          </NavDropdown.Item>
                        </LinkContainer>
                      ))}
                    </div>
                  ))}
              </NavDropdown>

              {/* Girls Dropdown */}
              <NavDropdown
                id="nav-dropdown-dark-girls"
                title="Girls"
                menuVariant="dark"
                className="me-3"
              >
                {categories
                  .filter((cat) => cat.title === 'girls')
                  .map((cat) => (
                    <div key={cat._id}>
                      <LinkContainer to={{ pathname: '/', search: `category=${cat._id}` }}>
                        <NavDropdown.Item>All Girls</NavDropdown.Item>
                      </LinkContainer>
                      {types.map((type) => (
                        <LinkContainer
                          key={type._id}
                          to={{ pathname: '/', search: `category=${cat._id}&productType=${type._id}` }}
                        >
                          <NavDropdown.Item>
                            {type.title.charAt(0).toUpperCase() + type.title.slice(1)}
                          </NavDropdown.Item>
                        </LinkContainer>
                      ))}
                    </div>
                  ))}
              </NavDropdown>

              {userInfo ? (
                <NavDropdown
                  title={
                    userInfo.user.local?.firstname
                      ? userInfo.user.local.firstname
                      : userInfo.user.facbook?.firstname
                      ? userInfo.user.facebook.firstname
                      : userInfo.user.google?.firstname
                  }
                  id='username'
                  className="me-3 ink"
                  menuVariant="dark"
                >
                  <NavDropdown.Item as={Link} to='/profile'>
                    <FaUser /> Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt /> Log Out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <LinkContainer to='/register'>
                    <Nav.Link className="me-3 ink">
                      <FaSignOutAlt /> Sign Up
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/login'>
                    <Nav.Link className="me-3 ink">
                      <FaUser /> Sign In
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
              <LinkContainer to='/wishlist'>
                <Nav.Link className="me-3 ink">
                  <FaHeart /> Wishlist
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to='/cart'>
                <Nav.Link className="me-3 ink">
                  <FaShoppingCart /> Cart
                  {cartItems?.length > 0 && (
                    <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                      {cartItems?.reduce((a, c) => a + Number(c.quantity), 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo && userInfo.user?.role === 'admin' && (
                <NavDropdown 
                title='Admin' 
                id='adminmenu'
                menuVariant="dark"
                >
                  <NavDropdown.Item as={Link} to='/admin/productlist'>
                    Products
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/admin/orders'>
                    Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/admin/users'>
                    Users
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/admin/categories'>
                    Categories
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/admin/types'>
                    Product Types
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/admin/coupons'>
                    Coupons
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/admin/enquires'>
                    Enquires
                  </NavDropdown.Item>
                </NavDropdown>
              )}
             <NavDropdown 
  title='Sale' 
  id='sale'
  menuVariant="dark"
>
  <LinkContainer to={{ pathname: '/', search: 'sale=true' }}>
    <NavDropdown.Item>All</NavDropdown.Item>
  </LinkContainer>
  {types.map((type) => (
    <LinkContainer
      key={type._id}
      to={{ pathname: '/', search: `productType=${type._id}&sale=${type.title}` }}
    >
      <NavDropdown.Item>
        {type.title.charAt(0).toUpperCase() + type.title.slice(1)}
      </NavDropdown.Item>
    </LinkContainer>
  ))}
</NavDropdown>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
