import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productSlice';
import { useGetCouponsQuery } from '../slices/couponApiSlices';
import Loader from '../components/Loader';
import { Carousel, Image, Row, Col, Form } from 'react-bootstrap';
import Message from '../components/Message';
import Product from '../components/Products';
import Meta from '../components/Meta';



const HomeScreen = () => {
  const home = true;
  const { data, isLoading, error } = useGetProductsQuery({home});
  const products = data?.products || [];
  console.log(products);
  const { data: couponData } = useGetCouponsQuery();
  const coupons = couponData?.coupons || [];

 
 
  return (
    <>
    <Meta title='Home Page' />
    {isLoading && <Loader />}
    {error && <Message variant="danger">{error?.data?.message}</Message>}
    <Row>
    <Carousel pause='hover' className='carousel bg-light'>
        <Carousel.Item >
          <Link to={'/allproducts'}>
            <Image src="/images/banner.jpg" alt='first image'  fluid />
          </Link>
        </Carousel.Item>
        <Carousel.Item >
          <Link to={'/allproducts'}>
            <Image src="/images/banner2.png" alt='first image' fluid />
            
          </Link>
        </Carousel.Item>
        <Carousel.Item >
          <Link to={'/allproducts'}>
            <Image src="/images/banner1.jpg" alt='first image' fluid />
            
          </Link>
        </Carousel.Item>
        <Carousel.Item >
          <Link to={'/allproducts'}>
            <Image src="/images/banner4.jpeg" alt='first image'  fluid />
            
          </Link>
        </Carousel.Item>
    </Carousel>
    </Row>
    <Row className='coupclass'>
    <Col md={12}>
      <div className='coupon mb-5'>
        <Form className='couponform'>
          <Form.Group className='mb-3 w-50 fw-bold text-success' controlId='code'>
            <Form.Control 
            type='text' 
            value={coupons[0]?.title}
            className=' fw-bold text-success' 
            />
          </Form.Group>
        </Form>

      </div>
      </Col >

      </Row>
    <Row className='d-flex justify-content-between'>
    
      <Col md={5}>
      <Link to={'/allproducts?category=6664c61184fd65654a3f6f2a'}>
      <div className='girls mt-5'>
      </div>
        </Link>
      </Col>
      <Col md={5}>
      <Link to={'/allproducts?category=6664c5f184fd65654a3f6f26'}>
      <div className='boys mt-5'>
      </div>
      </Link>
      </Col>
    </Row>

    <Row>
      <Col md={12}>
      <h3 className='text-center text-success mt-5'>New Products</h3>
      </Col>
      </Row>
      <Row>
            {products?.map((product) => (
              product.images[0].url !== 'sample image' && 
              <Col key={product._id} sm={12} md={2} >
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <div className='text-center'>
            <Link to='/allproducts'>
              <button className='btn btn-success'>Load More</button>
            </Link>
          </div>
    </>
  );
};


export default HomeScreen;