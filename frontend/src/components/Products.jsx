import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded ' >
      <Link to={`/products/${product._id}`}>
        <Card.Img src={product.images[0].url} variant='top' />
      </Link>

      <Card.Body>
        <Link to={`/products/${product._id}`} className="text-decoration-none">
          
        </Link>
        <hr />
        <Card.Title as='div' className='product-title'>
            <strong className='text-center mb-0'>{product.name}</strong>
          </Card.Title>
        <Card.Text as='h5'>${product.price}</Card.Text>
        <Card.Text as='div'>
        <Rating
            value={product.totalrating}
            text={`${product.totalrating} reviews`}
          />
          </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;