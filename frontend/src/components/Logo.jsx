import Dynamik2 from "/Dynamik2.png"
import { Container } from "react-bootstrap";
import Image from 'react-bootstrap/Image';
import { FaPhone, FaSearch } from "react-icons/fa";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Logo = () => {
  return (
    <Container fluid="md" className="d-flex mb-2">
     <p className="mt-5 ms-1 fw-bold"> <FaPhone className="text-danger ms-2"/> +2347090567890 </p>
     <Image src={ Dynamik2} className="logo  mx-auto" />
     <Form className="d-flex mt-5 ">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2 search"
              aria-label="Search"
            />
            <Button variant="link" className=""><FaSearch className="fs-4 mb-3 text-dark"/></Button>
          </Form>
          
     </Container>
  )
}

export default Logo