import { Table, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useGetOrdersQuery } from '../slices/orderApiSlice';
import { Link } from 'react-router-dom';

const AllOrderScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      <h1>Orders</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
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
                <td>{order._id.toString().substring(0,7)}</td>
                <td>
                {order.user.local ? (
    <>
      {order.user.local.firstname} {order.user.local.lastname}<br />
    </>
  ) : order.user.google ? (
    <>
      {order.user.google.firstname} {order.user.google.lastname}<br />
    </>
  ) : (
    <>
      {order.user.facebook.firstname} {order.user.facebook.lastname}
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
    </>
  );
};

export default AllOrderScreen;