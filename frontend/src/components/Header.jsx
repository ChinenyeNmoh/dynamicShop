import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Badge } from 'react-bootstrap';
import { FaHeart, FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useLogoutMutation } from '../slices/userApiSlice';
import { deleteCredentials } from '../slices/authSlice';
import Loader from './Loader';
import { toast } from 'react-toastify';
import { resetCart } from '../slices/cartSlice';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth)  
  console.log('userInfo', userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();

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
              <NavDropdown
                id="nav-dropdown-dark-all"
                title="All"
                menuVariant="dark"
                className="me-3"
              >
                <LinkContainer to="/">
                  <NavDropdown.Item>All Products</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to={{ pathname: '/', search: 'productType=6664c7a33164a2e360ba7abe' }}>
                  <NavDropdown.Item>All Clothings</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to={{ pathname: '/', search: 'productType=6664c7b43164a2e360ba7ac2' }}>
                  <NavDropdown.Item>All Shoes</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to={{ pathname: '/', search: 'productType=6664c7c33164a2e360ba7ac6' }}>
                  <NavDropdown.Item>All Accessories</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <NavDropdown
                id="nav-dropdown-dark-boys"
                title="Boys"
                menuVariant="dark"
                className="me-3"
              >
                <LinkContainer to={{ pathname: '/', search: 'category=6664c5f184fd65654a3f6f26' }}>
                  <NavDropdown.Item>All</NavDropdown.Item>

                </LinkContainer>
                <LinkContainer to={{ pathname: '/', search: 'category=6664c5f184fd65654a3f6f26&productType=6664c7a33164a2e360ba7abe' }}>
                  <NavDropdown.Item>Clothings</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to={{ pathname: '/', search: 'category=6664c5f184fd65654a3f6f26&productType=6664c7b43164a2e360ba7ac2' }}>
                  <NavDropdown.Item>Shoes</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to={{ pathname: '/', search: 'category=6664c5f184fd65654a3f6f26&productType=6664c7c33164a2e360ba7ac6' }}>
                  <NavDropdown.Item>Accessories</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <NavDropdown
                id="nav-dropdown-dark-girls"
                title="Girls"
                menuVariant="dark"
                className="me-5"
              >
                <LinkContainer to={{ pathname: '/', search: 'category=6664c61184fd65654a3f6f2a' }}>
                  <NavDropdown.Item>All</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to={{ pathname: '/', search: 'category=6664c61184fd65654a3f6f2a&productType=6664c7a33164a2e360ba7abe' }}>
                  <NavDropdown.Item>Clothings</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to={{ pathname: '/', search: 'category=6664c61184fd65654a3f6f2a&productType=6664c7b43164a2e360ba7ac2' }}>
                  <NavDropdown.Item>Shoes</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to={{ pathname: '/', search: 'category=6664c61184fd65654a3f6f2a&productType=6664c7c33164a2e360ba7ac6' }}>
                  <NavDropdown.Item>Accessories</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              { userInfo ? (
                 
                  <NavDropdown title={userInfo.user.local?.firstname ? (userInfo.user.local.firstname) : userInfo.user.facbook?.firstname? (userInfo.user.facebook.firstname) : userInfo.user.google?.firstname} id='username' className="me-3 ink">
                    <NavDropdown.Item as={Link} to='/profile'>
                    <FaUser />Profile
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
              <LinkContainer to='/orders'>
                <Nav.Link className="ink">
                  <FaUser /> Orders
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
