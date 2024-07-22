import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap';
import Rating from '../components/Rating';
import { useGetProductDetailsQuery, useProductRatingMutation } from '../slices/productSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { setCredentials } from '../slices/authSlice';
import { useCreateCartMutation } from '../slices/cartApiSlice';
import { useAddWishMutation } from '../slices/userApiSlice';
import Meta from '../components/Meta';

const ProductScreen = () => {
  const { id } = useParams();
  const [showAllComments, setShowAllComments] = useState(false);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { data, isLoading, error, refetch } = useGetProductDetailsQuery(id);
  const product = data?.product || {};
  const [ cartData, {isLoading: cartLoading, error: cartError} ] = useCreateCartMutation();
  const [addWish] = useAddWishMutation();
  const [ratingData, { isLoading: ratingLoading }] = useProductRatingMutation();
  

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

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

  const addToWishHandler = async () => {
    try{
      const res = await addWish({productId: product._id}).unwrap();
      console.log(res)
      dispatch(setCredentials({ ...res }));
      toast.success(res.message)

    }catch(err){
      toast.error(err?.data?.message || err.error);
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await ratingData({
        prodId: product._id,
        star: rating,
        comment,
      }).unwrap();
  
      // Clear the input fields after successful submission
      setRating(0);
      setComment('');
  
      toast.success(res.message);
      refetch();
    } catch (err) {
      console.error('Error submitting rating:', err?.message || err.error);
      toast.error(err?.message || err.error);
    }
  };
  


  const renderComments = () => {
    if (!product.ratings) return null;
    const commentsToShow = showAllComments ? product.ratings : product.ratings.slice(0, 1);
    return commentsToShow.map((c, index) => (
      <ListGroup.Item key={index}>
        <span>{c.comment}</span>
        <span>{c.star && <Rating value={c.star} text={c.star} />}</span>
        <span className="fw-bold">By:</span>{' '}
        {c.postedby &&
          (c.postedby.local?.email ||
            c.postedby.google?.email ||
            c.postedby.facebook?.email)}
            <br />
            <span className="fw-bold mt-1">Date:</span>{' '}
        { c.dateCreated && c.dateCreated.toString().substring(0, 10)}
        <hr />
      </ListGroup.Item>
    ));
  };

  return (
    <>
    <Meta title={product.name} description={product.description} />
    {cartLoading && <Loader />}
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error?.data?.error}</Message>
        
      ) : (
        <>
          <Row>
            <Col md={5}>
              {product.images && product.images.length > 0 && (
                <Image src={product.images[0].url} alt={product.name} fluid />
              )}
                   <Col className="mt-3">
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
                      className="btn-block ms-5"
                      type="button"
                      disabled={product.quantity === 0}
                      onClick={addToCartHandler}
                    >
                      Cart
                    </Button>
                    <Button
                      className="btn-block"
                      type="button"
                      variant="success"
                      onClick={() => addToWishHandler(product)}
                    >
                      Wishlist
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
            </Col>
            <Col md={7} >
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
                    <span className="text-muted text-decoration-line-through">Price: ${product.price}</span> 
                    <br />
                    <span className="fw-bold">Sales Price: N{product.discountedPrice}</span> 
                    </>
                  ):
                    (<span className="fw-bold">Price: N{product.price}</span> )}
                 
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="fw-bold">Description:</span> {product.description}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h5 className="text-center">Comments</h5>
                  {product.ratings && product.ratings.length === 0 && <Message>No comments yet</Message>}
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
              <Col className='review'>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3 className='text-center text-success'>Rate Product</h3>

                  {ratingLoading && <Loader />}

                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group className='my-2' controlId='rating'>
                        <Form.Label className='fw-bold'>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          required
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className='my-2' controlId='comment'>
                        <Form.Label className='fw-bold'>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          row='3'
                          required
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={ratingLoading}
                        type='submit'
                        variant='primary'
                        className='d-block me-auto ms-auto mt-4'
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to='/login'>sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            </Col>

       
          </Row>

        </>
      )}
    </>
  );
};

export default ProductScreen;
