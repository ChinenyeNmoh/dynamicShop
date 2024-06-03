import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { 
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
 } from 'react-icons/fa';

const Header = () => {
  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>DynamicShop</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className="m-auto gap-4">
              <NavDropdown
                id="nav-dropdown-dark-example"
                title="All"
                menuVariant="dark"
                className="me-3"
              >
                <LinkContainer to="/some-route">
                  <NavDropdown.Item>Action</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/another-route">
                  <NavDropdown.Item>Another action</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <NavDropdown
                id="nav-dropdown-dark-example"
                title="Boys"
                menuVariant="dark"
                className="me-3"
              >
                <LinkContainer to="/some-route">
                  <NavDropdown.Item>Action</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/another-route">
                  <NavDropdown.Item>Another action</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <NavDropdown
                id="nav-dropdown-dark-example"
                title="Girls"
                menuVariant="dark"
                className="me-5"
              >
                <LinkContainer to="/some-route">
                  <NavDropdown.Item>Action</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/another-route">
                  <NavDropdown.Item>Another action</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <LinkContainer to='/login'>
                <Nav.Link className="me-3 ink">
                  <FaUser /> Sign In
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to='/signout'>
                <Nav.Link className="me-3 ink">
                  <FaSignOutAlt /> Sign Out
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to='/wishlist'>
                <Nav.Link className="me-3 ink">
                  <FaHeart /> Wishlist
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to='/cart'>
                <Nav.Link className="me-3 ink">
                  <FaShoppingCart /> Cart
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
