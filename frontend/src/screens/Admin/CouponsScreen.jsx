import { Table, Button, Row, Col, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetCouponsQuery, useCreateCouponMutation, useUpdateCouponMutation, useDeleteCouponMutation } from '../../slices/couponApiSlices';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

const CouponsScreen = () => {
  const { data, isLoading, error, refetch } = useGetCouponsQuery();
  const coupons = data?.coupons || [];
  const [deleteCoupon, { isLoading: loadingDelete }] = useDeleteCouponMutation();
  const [createCoupon, { isLoading: loadingCreate }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: loadingUpdate }] = useUpdateCouponMutation();

  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [discount, setDiscount] = useState();
  const [editCouponId, setEditCouponId] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = (coupon) => {
    setEditCouponId(coupon._id);
    setTitle(coupon.title);
    setDiscount(coupon.discount);
    setShow(true);
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete Coupon?')) {
      try {
        const res = await deleteCoupon(id).unwrap();
        toast.success(res.message);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const editCouponHandler = async (e) => {
    e.preventDefault();
    if (title === '') {
      toast.error('Title cannot be empty');
      return;
    } else if (discount === '') {
      toast.error('Discount cannot be empty');
      return;
    }
    try {
      const res = await updateCoupon({ id: editCouponId, title, discount }).unwrap();
      toast.success(res.message);
      handleClose();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const createCouponHandler = async () => {
    if (window.confirm('Are you sure you want to create a new Coupon?')) {
      try {
        const res = await createCoupon().unwrap();
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
          <h3>Coupon</h3>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createCouponHandler}>
            <FaPlus /> Create Coupon
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {loadingUpdate && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message || 'No Coupon Available'}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>TITLE</th>
                <th>DISCOUNT</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td>{c._id}</td>
                  <td>{c.title}</td>
                  <td>{c.discount}</td>
                  <td>
                    <Button
                      onClick={() => handleShow(c)}
                      variant='light'
                      className='btn-sm mx-2'
                    >
                      <FaEdit />
                    </Button>
                    <Modal show={show} onHide={handleClose} centered>
                      <Modal.Body>
                        <Form onSubmit={editCouponHandler}>
                          <Form.Group className="my-2" controlId="title">
                            <Form.Label className="fw-bold">Title</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder="Enter title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                            />
                          </Form.Group>
                          <Form.Group className="my-2" controlId="discount">
                            <Form.Label className="fw-bold">Discount</Form.Label>
                            <Form.Control
                              type ='number'
                              placeholder="Enter discount"
                              value={discount}
                              onChange={(e) => setDiscount(e.target.value)}
                            />
                          </Form.Group>
                          <Modal.Footer>
                            <Button
                              variant="outline-secondary" 
                              type ="submit"
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
                      onClick={() => deleteHandler(c._id)}
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

export default CouponsScreen;
