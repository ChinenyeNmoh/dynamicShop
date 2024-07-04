import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useGetOrderQuery } from '../slices/orderApiSlice';

const OrderDetailScreen = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetOrderQuery(id);
  const order = data?.order;

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h3 className='text-success mb-4'>Order {order._id.toString().substring(0,7)}</h3>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3 className='mb-3'>Shipping</h3>
              <p>
                <strong> Recipient Name:</strong> {order.shippingAddress.recipientName}
                </p>
                <p>
                <strong>Recipient Phone No:</strong> {order.shippingAddress.recipientMobile}
                </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.street}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.landmark},{' '}{order.shippingAddress.state}{' '}
                {order.shippingAddress.country}
              </p>
              {order.orderStatus === 'delivered' ? (
                <Message variant='success'>
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item className='mt-3'>
              <h3 className='text-success'>Payment Method</h3>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.paymentStatus === 'paid' ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
            <h3 className='text-success'>Purchased Items</h3>
              {order.products.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.products.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.productId.images[0].url}
                            alt={item.productId.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/products/${item.productId._id}`}>
                            {item.productId.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.quantity} x N{item.price} = N{item.quantity * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col className='fw-bold'>Item Prices</Col>
                  <Col>N{order.cartTotal}</Col>
                </Row>
              </ListGroup.Item>
              {order.totalAfterCoupon > 0 && (
                <ListGroup.Item>
                <Row>
                  <Col className='fw-bold'>TotalAfterCoupon</Col>
                  <Col>N{order.totalAfterCoupon}</Col>
                </Row>
              </ListGroup.Item>
              )}
              <ListGroup.Item>
                <Row>
                  <Col className='fw-bold'>Shipping Fee</Col>
                  <Col>N{order.shippingFee}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col className='fw-bold'>Tax Fee</Col>
                  <Col>N{order.taxFee}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col className='fw-bold'>Total Price</Col>
                  <Col>N{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* PAY ORDER PLACEHOLDER */}
              {/* {MARK AS DELIVERED PLACEHOLDER} */}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderDetailScreen;