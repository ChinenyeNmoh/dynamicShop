import { Table, Button, Row, Col, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetCategoriesQuery, 
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
    useUpdateCategoryMutation 
} from '../../slices/categoryApiSlice';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

const CategoryScreen = () => {
  const { data, isLoading, error, refetch } = useGetCategoriesQuery();
  const categories = data?.categories || [];
  const [deleteCategory, { isLoading: loadingDelete }] = useDeleteCategoryMutation();
  const [createCategory, { isLoading: loadingCreate }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: loadingUpdate }] = useUpdateCategoryMutation();

  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = (category) => {
    setEditCategoryId(category._id);
    setTitle(category.title);
    setShow(true);
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        const res = await deleteCategory(id).unwrap();
        toast.success(res.message);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const editCategoryHandler = async (e) => {
    e.preventDefault();
    if (title.trim() === '') {
      toast.error('Title cannot be empty');
      return;
    }
    try {
      const res = await updateCategory({ id: editCategoryId, title }).unwrap();
      toast.success(res.message);
      handleClose();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const createCategoryHandler = async () => {
    if (window.confirm('Are you sure you want to create a new category?')) {
      try {
        const res = await createCategory().unwrap();
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
          <h3>Categories</h3>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createCategoryHandler}>
            <FaPlus /> Create Category
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
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td>{cat._id}</td>
                  <td>{cat.title}</td>
                  <td>
                    <Button
                      onClick={() => handleShow(cat)}
                      variant='light'
                      className='btn-sm mx-2'
                    >
                      <FaEdit />
                    </Button>
                    <Modal show={show} onHide={handleClose} centered>
                      <Modal.Body>
                        <Form onSubmit={editCategoryHandler}>
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
                      onClick={() => deleteHandler(cat._id)}
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

export default CategoryScreen;
