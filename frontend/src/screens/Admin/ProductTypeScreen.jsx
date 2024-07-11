import { Table, Button, Row, Col, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetTypesQuery, useCreateTypeMutation, useDeleteTypeMutation, useUpdateTypeMutation
} from '../../slices/typeApiSlice';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

const ProductTypeScreen = () => {
  const { data, isLoading, error, refetch } = useGetTypesQuery();
  const types = data?.types || [];
  const [deleteType, { isLoading: loadingDelete }] = useDeleteTypeMutation();
  const [createType, { isLoading: loadingCreate }] = useCreateTypeMutation();
  const [updateType, { isLoading: loadingUpdate }] = useUpdateTypeMutation();

  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [editTypeId, setEditTypeId] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = (type) => {
    setEditTypeId(type._id);
    setTitle(type.title);
    setShow(true);
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete type?')) {
      try {
        const res = await deleteType(id).unwrap();
        toast.success(res.message);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const editTypeHandler = async (e) => {
    e.preventDefault();
    if (title.trim() === '') {
      toast.error('Title cannot be empty');
      return;
    }
    try {
      const res = await updateType({ id: editTypeId, title }).unwrap();
      toast.success(res.message);
      handleClose();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const createTypeHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product type?')) {
      try {
        const res = await createType().unwrap();
        toast.success(res.message);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h3>Product Types</h3>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createTypeHandler}>
            <FaPlus /> Create Type
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {loadingUpdate && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>TITLE</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {types.map((t) => (
                <tr key={t._id}>
                  <td>{t._id}</td>
                  <td>{t.title}</td>
                  <td>
                    <Button
                      onClick={() => handleShow(t)}
                      variant='light'
                      className='btn-sm mx-2'
                    >
                      <FaEdit />
                    </Button>
                    <Modal show={show} onHide={handleClose} centered>
                      <Modal.Body>
                        <Form onSubmit={editTypeHandler}>
                          <Form.Group className="my-2" controlId="title">
                            <Form.Label className="fw-bold">Title</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder="Enter title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                            />
                          </Form.Group>
                          <Modal.Footer>
                            <Button
                              variant="outline-secondary" 
                              type="submit"
                            >
                              Update
                            </Button>
                          </Modal.Footer>
                        </Form>
                      </Modal.Body>
                    </Modal>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(t._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default ProductTypeScreen;
