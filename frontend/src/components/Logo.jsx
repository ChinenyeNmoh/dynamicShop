import React, { useState } from 'react';
import Dynamik2 from '/Dynamik2.png';
import { Container } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { FaSearch } from 'react-icons/fa';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate, useParams,  useLocation } from 'react-router-dom';


const Logo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { keyword: urlKeyword } = useParams();
  const page = 1;

  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    
    const trimmedKeyword = keyword.trim();
    const currentPath = window.location.pathname;
    let query = queryParams.toString();

    if (trimmedKeyword) {
      if (currentPath.startsWith('/admin/orders')) {
        navigate(`/admin/orders/${trimmedKeyword}/${page}?${query}`);
      } else if (currentPath.startsWith('/admin/products')) {
        navigate(`/admin/products/${trimmedKeyword}/${page}?${query}`);
      } else if (currentPath.startsWith('/admin/users')) {
        navigate(`/admin/users/${trimmedKeyword}/${page}?${query}`);
      } else if (currentPath.startsWith('/admin/enquires')) {
        navigate(`/admin/enquires/${trimmedKeyword}/${page}?${query}`);
      } else {
        navigate(`/allproducts/${trimmedKeyword}/${page}?${query}`);
      }
      setKeyword('');
    } else {
      if (currentPath.startsWith('/admin/orders')) {
        navigate(`/admin/orders?${query}`);
      } else if (currentPath.startsWith('/admin/products')) {
        navigate(`/admin/products?${query}`);
      } else if (currentPath.startsWith('/admin/users')) {
        navigate(`/admin/users?${query}`);
      } else if (currentPath.startsWith('/admin/enquires')) {
        navigate(`/admin/enquires?${query}`);
      } else {
        navigate(`/allproducts?${query}`);
      }
    }
  };

  
  return (
    <Container fluid="md" className="d-flex  justify-content-between mb-2">
      <Image src={Dynamik2} className="logo " />
      <Form className="d-flex mt-5" onSubmit={submitHandler}>
        <Form.Control
          type="search"
          placeholder="Search"
          className="me-2 search"
          aria-label="Search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          
        />
        <Button variant="link" className="" type="submit">
          <FaSearch className="fs-4 mb-3 text-dark" />
        </Button>
      </Form>
    </Container>
  );
};

export default Logo;
