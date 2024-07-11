import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Container, Row, Col} from "react-bootstrap";
import { IoMdMail } from "react-icons/io";
import { FaLocationDot, FaXTwitter  } from "react-icons/fa6";
import { FaUser, FaPhone, FaInstagram, FaFacebook,   } from "react-icons/fa";
import { Link } from "react-router-dom"
import Image from 'react-bootstrap/Image';
import { useCreateEnquiryMutation } from '../slices/enquiryApiSlice';
import Loader from './Loader';
import { useState } from 'react';
import { AiOutlineMessage } from "react-icons/ai";
import {toast} from 'react-toastify';



const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [mobile, setMobile] = useState('');
    const [createEnquiry, { isLoading }] = useCreateEnquiryMutation();

    const enquiryHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await createEnquiry({
                name,
                email,
                message,
                mobile,
            }).unwrap();
            setName('');
            setEmail('');
            setMessage('');
            setMobile('');
            
            toast.success(res.message);
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message || error.error);
        }
    }
  return (
    <footer className="bg-dark">
      {isLoading && <Loader />}
      <Container >
        <Row className="d-flex justify-content-between">
        <Col md={4} className="text-white">
        <h3 className="text-center mt-4 mb-4 pt-3 text-primary">About Us</h3>
        <p className="fst-italic"> 
        DynamikShop is an indigenous premium brand for quality children’s clothing, shoes and accessories.
        The brand was founded by Adenike Ogunlesi in 1996 as a solution to the unavailability of quality kids’ clothing and to showcase the possibilities that abound in Nigeria.
        <br />
        <br />
        We are thought leaders in retail fashion and in the kids’ fashion space, creating well-tailored garments that are fun, on trend and colorful; giving children extreme confidence when worn.
        </p>
          </Col>
          <Col md={4} className="text-white ">
          <h3 className="text-center text-primary mt-4 mb-4 pt-3" >Quick Links</h3>
          <p >
            <FaLocationDot className="text-danger me-2 "/>
            Plot 25, Block 72 Adebisi Popoola Crescent Off Victoria Arobieke, Lekki Phase 1, Lagos, Nigeria.
            </p>
            <p>
            <FaPhone className="text-light me-2 "/>
            +2347090567890, +2347047893564
            </p>
            <p>
            <IoMdMail className="text-light me-2 " />info@dynamikshop.com
            </p>
            <h3 className="fst-normal mb-3 text-center text-primary">Follow Us</h3>
            <div className="d-flex gap-3">
            <Link to="#">
            <FaFacebook className="text-primary fs-4"/>
            </Link>
            <Link to="#">
            <Image src='/images/instagram.png' className='google'></Image>
            </Link>
            <Link to="#">
            <FaXTwitter className="text-white fs-4 " />
            </Link>
            </div>
            

          </Col>
          <Col md={4} className="text-primary">
            <h3 className="text-center mt-4 mb-4 pt-3">Send a Message</h3>
            <Form onSubmit={enquiryHandler}>
              <InputGroup className="mb-3 ">
                <InputGroup.Text ><FaUser /></InputGroup.Text>
                <Form.Control 
                type="text" 
                placeholder="John Doe" 
                className="fst-italic"
                onChange={(e) => setName(e.target.value)}
                 />
              </InputGroup>

              <InputGroup className="mb-3">
                <InputGroup.Text ><FaPhone /></InputGroup.Text>
                <Form.Control 
                type="number" 
                placeholder="09090000000" 
                className="fst-italic"
                onChange={(e) => setMobile(e.target.value)}
                />
              </InputGroup>

              <InputGroup className="mb-3">
                <InputGroup.Text ><IoMdMail /></InputGroup.Text>
                <Form.Control 
                type="email" 
                placeholder="johndoe@email.com" 
                className="fst-italic"
                onChange={(e) => setEmail(e.target.value)}
                 />
              </InputGroup>

              <InputGroup className="mb-3">
              <InputGroup.Text ><AiOutlineMessage /></InputGroup.Text>
                <Form.Control 
                as="textarea" 
                placeholder="Enter your message here" 
                className="fst-italic"
                onChange={(e) => setMessage(e.target.value)}
                />
                </InputGroup>

              <Button 
              variant="primary" 
              type="submit" 
              className="send"
              >
                send
              </Button>
            </Form>
            
          </Col>
          
          <p className="text-dark text-center fw-bold">ProShop &copy; {currentYear}</p>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer