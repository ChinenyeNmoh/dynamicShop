import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap';
import Rating from '../components/Rating';
import products from '../products';
import { FaPlus, FaMinus } from "react-icons/fa";

const ProductScreen = () => {
  const { id } = useParams();
  const product = products.find((p) => p._id === id);

  return (
    <>
      <Link to='/' className='btn btn-light my-3'>
        Go Back
      </Link>
      <Row>
        <Col md={5}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>
        <Col md={7}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="fw-bold">Price:</span> ${product.price}
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="fw-bold">Description:</span> {product.description}
            </ListGroup.Item>
            <ListGroup.Item>
              <h5 className="text-center">Comments</h5>
              {product.comments && product.comments.map((comment, index) => (
                <ListGroup.Item key={index}>
                  {comment}
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={5}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${product.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col md={6} className="fw-bold mb-2">Status:</Col>
                  <Col md={6} className="mb-2">
                    {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                  </Col>
                  <Col md={6} className="fw-bold">Quantity:</Col>
                  <Col md={3}>
                    <div className="d-flex justify-content-between border border-dark p-1">
                      <Link to="#" className="text-dark">
                        <FaPlus />
                      </Link>
                      <Link to="#" className="text-dark">
                        <FaMinus />
                      </Link>
                    </div>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item className="d-flex gap-5">
                <Button
                  className='btn-block'
                  type='button'
                  disabled={product.countInStock === 0}
                >
                  Add To Cart
                </Button>
                <Button
                  className='btn-block'
                  type='button'
                  variant="success"
                >
                  Add To Wishlist
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;
