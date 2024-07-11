import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetUsersQuery,
     useDeleteUserMutation } from '../../slices/userApiSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AllUsersScreen = () => {
  const { data, refetch, isLoading, error } = useGetUsersQuery();
  const users = data?.users
  
 
  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        const res = await deleteUser(id).unwrap;
        toast.success( res.message)
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <h1 className='text-center text-success'>Users</h1>
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
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id.toString().substring(0,7)}</td>
                <td>
                  {user.local ? (
                    <>
                      {user.local.firstname} {user.local.lastname}<br />
                    </>
                  ) : user.google ? (
                    <>
                      {user.google.firstname} {user.google.lastname}<br />
                    </>
                  ) : (
                    <>
                      {user.facebook.firstname} {user.facebook.lastname}
                    </>
                  )}
                </td>
                <td>
                  {user.google ? (
                    <>
                    <a href={`mailto:${user.google.email}`}>{user.google.email}</a><br />
                    
                    </>
                  ) : user.local ? (
                    <>
                        <a href={`mailto:${user.local.email}`}>{user.local.email}</a><br />
                    </>
                  ) : (
                    <>
                       <a href={`mailto:${user.facebook.email}`}>{user.facebook.email}</a>
                    </>
                  )}
                </td>
                <td>
                  {user.role === 'admin' ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {user.role !== 'admin' && (
                    <>
                      <Button
                        as={Link}
                        to={`/admin/user/${user._id}/edit`}
                        style={{ marginRight: '10px' }}
                        variant='light'
                        className='btn-sm'
                      >
                        <FaEdit className='fs-4 text-success'/>
                      </Button>
                      <Button
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteHandler(user._id)}
                      >
                        <FaTrash />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default AllUsersScreen;