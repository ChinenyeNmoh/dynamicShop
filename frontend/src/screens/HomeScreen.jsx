import { Row, Col, Form, Button} from 'react-bootstrap';
import Product from '../components/Products'; // Ensure correct path
import { useGetProductsQuery } from '../slices/productSlice';
import Loader from '../components/Loader';
import Flash from '../components/Flash';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';



const HomeScreen = () => {
  const location = useLocation();
  const [sort, setSort] = useState('');
  
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category') || '';
  const productType = queryParams.get('productType') || '';
  const sale = queryParams.get('sale' || '')
  

  let isLoading, error, data;
    ({ data, isLoading, error } = useGetProductsQuery({ category, productType, sort, sale }));
  const products = data?.products || [];
 
 
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Flash error={error?.data?.message} data={data} />
      ) : (
        <>
          <Row className='d-flex align-items-center'>
            <Col sm={12} md={6} lg={4} xl={3}>
              <Form>
                <Form.Group className='mb-3' controlId='sort'>
                  <Row>
                    <Col md={2}>
                    <Form.Label className='mt-2 fw-bold'>Sort</Form.Label>
                    </Col>
                    <Col>
                    <Form.Select
                    value={sort}
                    onChange={
                      (e) => setSort(e.target.value)
                    }
                  >
                    <option value=''>Default</option>
                    <option value='low' className={sort === 'low'? 'bg-primary': ''}>Lowest Price</option>
                    <option value='high' className={sort === 'high'? 'bg-primary': ''}>Highest Price</option>
                    <option value='old' className={sort === 'old'? 'bg-primary': ''}>Newest</option>
                    <option value='alphabetical' className={sort === 'alphabetical'? 'bg-primary': ''}>Alphabetical</option>
                    <option value='rating' className={sort === 'rating'? 'bg-primary': ''}>Rating</option>
                  </Form.Select>
                    </Col>
                    <Col md={3}>
                    <Button
                type='button'
                className='btn btn-secondary mb-3'
                onClick={() => setSort('')}
              >
                Reset
              </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Col>
            <Col sm={12} md={6} lg={4} xl={3}>
             
            </Col>
          </Row>
         
         
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
