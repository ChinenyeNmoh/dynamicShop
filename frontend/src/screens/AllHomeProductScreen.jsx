import { Row, Col, Form, Button} from 'react-bootstrap';
import Product from '../components/Products';
import { useGetProductsQuery } from '../slices/productSlice';
import Loader from '../components/Loader';
import Flash from '../components/Flash';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import Paginate from '../components/Paginate';
import Message from '../components/Message';



const AllHomeProductScreen = () => {
  const { page = 1, keyword = "" } = useParams();
  console.log(`page = ${page} keyword = ${keyword}`);
  const location = useLocation();
  const [sort, setSort] = useState('');
  
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category') || '';
  const productType = queryParams.get('productType') || '';
  const sale = queryParams.get('sale') || '';

  const { data, isLoading, error } = useGetProductsQuery({ category, productType, sort, sale, keyword, page });
  const products = data?.products || [];
 
  return (
    <>
      {keyword && <Link to='/' className='btn btn-light mb-4'>Go Back</Link>}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error?.data?.error}</Message>
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
                        onChange={(e) => setSort(e.target.value)}
                      >
                        <option value=''>Default</option>
                        <option value='low'>Lowest Price</option>
                        <option value='high'>Highest Price</option>
                        <option value='old'>Oldest</option>
                        <option value='alphabetical'>Alphabetical</option>
                        <option value='rating'>Rating</option>
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
          </Row>

          <Row>
            {products?.map((product) => (
              product.images[0].url !== 'sample image' && 
              <Col key={product._id} sm={12} md={4} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate 
            totalPages={data?.totalPages} 
            page={data?.page} 
            allProducts={true} 
            keyword={keyword} 
            category={category}
            productType={productType}
            sale={sale}
          />
        </>
      )}
    </>
  );
};


export default AllHomeProductScreen;
