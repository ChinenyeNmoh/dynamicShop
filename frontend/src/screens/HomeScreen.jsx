import { Row, Col } from 'react-bootstrap';
import Product from '../components/Products'; // Ensure correct path
import { useGetProductsQuery } from '../slices/productSlice';
import Loader from '../components/Loader';
import Flash from '../components/Flash';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';



const HomeScreen = () => {
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category') || '';
  const productType = queryParams.get('productType') || '';
  

  let isLoading, error, data;
    ({ data, isLoading, error } = useGetProductsQuery({ category, productType }));
  const products = data?.products || [];
  

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Flash error={error?.data?.message} data={data} />
      ) : (
        <>
          <h1>Latest Products</h1>
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
