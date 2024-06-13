import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap';
import Rating from '../components/Rating';
import { FaPlus, FaMinus } from "react-icons/fa";
import axios from 'axios';

const ProductScreen = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${id}`);
      console.log(data.product);
      setProduct(data.product || {});
    };
    fetchProduct();
  }, [id]);

  const renderComments = () => {
    if (!product.ratings) return null;
    const commentsToShow = showAllComments ? product.ratings : product.ratings.slice(0, 1);
    return commentsToShow.map((c, index) => (
      <ListGroup.Item key={index}>
        {c.comment}
        {c.star && <Rating value={c.star} text={c.star} />}
        <span className="fw-bold">By:</span> {c.postedby && (c.postedby.local?.email || c.postedby.google?.email || c.postedby.facebook?.email)}
        <hr />
      </ListGroup.Item>
    ));
  };

  return (
    <>
      <Link to='/' className='btn btn-light my-3'>
        Go Back
      </Link>
      <Row>
        <Col md={5}>
          {product.images && product.images.length > 0 && (
            <Image src={product.images[0].url} alt={product.name} fluid />
          )}
        </Col>
        <Col md={7}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={product.totalrating}
                text={`${product.totalrating} reviews`}
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
              {renderComments()}
              {product.ratings && product.ratings.length > 1 && (
                <button
                  onClick={() => setShowAllComments(!showAllComments)}
                  className='mt-2 text-primary btn btn-link'
                >
                  {showAllComments ? 'Show Less' : 'Show More'}
                </button>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={5} className='mt-3'>
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
                    {product.quantity > 0 ? 'In Stock' : 'Out Of Stock'}
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
                  disabled={product.quantity === 0}
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
