import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap';
import Rating from '../components/Rating';
import { useGetProductDetailsQuery } from '../slices/productSlice';
import Loader from '../components/Loader';
import Flash from '../components/Flash';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { addToWish } from '../slices/wishListSlice';
import { useCreateCartMutation } from '../slices/cartApiSlice';


const ProductScreen = () => {
  const { id } = useParams();
  const [showAllComments, setShowAllComments] = useState(false);
  const [qty, setQty] = useState(1);

  const { data, isLoading, error } = useGetProductDetailsQuery(id);
  const product = data?.product || {};
  const [ cartData, {isLoading: cartLoading, error: cartError} ] = useCreateCartMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(cartError) {
      toast.error(cartError?.data?.message)
    }
  }, [cartError])


  const addToCartHandler = async () => {
    try{
      const id = product._id;
      const res = await cartData({id, qty}).unwrap();
      console.log(res)
      toast.success(res.message)
      dispatch(addToCart({...res} ));
    }catch(err){
      toast.error(err?.message || err.error);
    }
    
  };

  const addToWishHandler = () => {
    dispatch(addToWish({...product}));
    toast.success('Item added to wishlist')
  }
  const renderComments = () => {
    if (!product.ratings) return null;
    const commentsToShow = showAllComments ? product.ratings : product.ratings.slice(0, 1);
    return commentsToShow.map((c, index) => (
      <ListGroup.Item key={index}>
        {c.comment}
        {c.star && <Rating value={c.star} text={c.star} />}
        <span className="fw-bold">By:</span>{' '}
        {c.postedby &&
          (c.postedby.local?.email ||
            c.postedby.google?.email ||
            c.postedby.facebook?.email)}
        <hr />
      </ListGroup.Item>
    ));
  };

  return (
    <>
    {cartLoading && <Loader />}
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Flash error={error} data={data} />
        
      ) : (
        <>
          <Row>
            <Col md={5}>
              {product.images && product.images.length > 0 && (
                <Image src={product.images[0].url} alt={product.name} fluid />
              )}
            </Col>
            <Col md={7}>
              <ListGroup variant="flush">
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
                  {product.discountedPrice > 0 ? ( 
                    <>
                    <span className="text-muted text-decoration-line-through">Original Price: ${product.price}</span> 
                    <br />
                    <span className="fw-bold">Discounted Price: N{product.discountedPrice}</span> 
                    </>
                  ):
                    (<span className="fw-bold">Price: N{product.price}</span> )}
                 
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
                      className="mt-2 text-primary btn btn-link"
                    >
                      {showAllComments ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={5} className="mt-3">
              <Card>
                <ListGroup variant="flush">
                  

                  <ListGroup.Item>
                    <Row>
                      <Col md={6} className="fw-bold mb-2">
                        Status:
                      </Col>
                      <Col md={6} className="mb-2">
                        {product.quantity > 0 ? 'In Stock' : 'Out Of Stock'}
                      </Col>
                      <Col md={6} className="fw-bold">
                        Qty:
                      </Col>
                      <Col md={3}>
                        <Form.Control
                         as='select'
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.quantity).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item className="d-flex gap-5">
                    <Button
                      className="btn-block"
                      type="button"
                      disabled={product.quantity === 0}
                      onClick={addToCartHandler}
                    >
                      Add To Cart
                    </Button>
                    <Button
                      className="btn-block"
                      type="button"
                      variant="success"
                      onClick={addToWishHandler}
                    >
                      Add To Wishlist
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
