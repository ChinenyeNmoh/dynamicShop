import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetallOrdersQuery } from '../../slices/orderApiSlice';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Paginate from '../../components/Paginate';

const AllOrderScreen = () => {
  const { page=1, keyword="" } = useParams();
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const { data, isLoading, error, refetch } = useGetallOrdersQuery({ orderStatus, paymentStatus, keyword, page });
  const orders = data?.orders;
  

  useEffect(() => {
    if (error) {
      toast.error(error.data?.message);
    }
  }, [error]);

  const handleFilterChange = () => {
    // The query hook will automatically re-run with new query parameters
    refetch();
  };

  return (
    <>
      <h1 className='text-center text-success'>Orders</h1>
      <Row >
        <Col md={2} className='mb-3'>
          <Form.Group controlId="orderStatus">
            <Form.Label  className="me-2 fw-bold">Order Status</Form.Label>
            <Form.Control
              as="select"
              value={orderStatus}
              onChange={(e) => {
                setOrderStatus(e.target.value);
                handleFilterChange();
              }}
              className="mr-3"
            >
              <option value="">Filter order</option>
              <option value="ordered" className={orderStatus === 'ordered' ? 'bg-primary' : ''}>Ordered</option>
              <option value="delivered" className={orderStatus === 'delivered' ? 'bg-primary' : ''}>Delivered</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group controlId="paymentStatus">
            <Form.Label className="me-2 fw-bold">Payment Status</Form.Label>
            <Form.Control
              as="select"
              value={paymentStatus}
              onChange={(e) => {
                setPaymentStatus(e.target.value);
                handleFilterChange();
              }}
            >
              <option value="">Filter order</option>
              <option value="pending" className={paymentStatus === 'pending' ? 'bg-primary' : ''}>Pending</option>
              <option value="paid" className={paymentStatus === 'paid' ? 'bg-primary' : ''}>Paid</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error || error?.data?.error}
        </Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm mt-5'>
          <thead>
            <tr>
              <th>ID</th>
              <th>CUSTOMER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.toString().substring(0, 7)}</td>
                <td>
                  {order?.user?.google ? (
                    <>
                    {order.user?.google.firstname} {order.user?.google.lastname}<br />
                      
                    </>
                  ) : order?.user?.local ? (
                    <>
                      {order?.user?.local.firstname} {order?.user?.local.lastname}<br />
                    </>
                  ) : (
                    <>
                      {order?.user?.facebook.firstname} {order?.user?.facebook.lastname}
                    </>
                  )}
                </td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>N{order.totalPrice}</td>
                <td>
                  {order.paymentStatus === 'paid' ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {order.orderStatus === 'delivered' ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <Button
                    as={Link}
                    to={`/order/${order._id}`}
                    variant='primary'
                    className='btn-sm'
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Paginate
        page={data?.page}
        totalPages={data?.totalPages}
       allOrders={true}
       keyword={keyword}
      />
    </>
  );
};
export default AllOrderScreen;
