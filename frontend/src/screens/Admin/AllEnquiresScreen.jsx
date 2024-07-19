import { Table, Button, Row, Col, Modal, Card, Form } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { GrFormView } from "react-icons/gr";
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetEnquiriesQuery, useDeleteEnquiryMutation, useUpdateEnquiryMutation } from '../../slices/enquiryApiSlice';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import Paginate from '../../components/Paginate';
import { useParams } from 'react-router-dom';

const AllEnquiriesScreen = () => {
  const {page=1, keyword=''} = useParams();
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState('');
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const { data, isLoading, error, refetch } = useGetEnquiriesQuery({status, keyword, page});
  const enquiries = data?.enquiries || [];
  const [deleteEnquiry, { isLoading: loadingDelete }] = useDeleteEnquiryMutation();
  const [updateEnquiry, { isLoading: loadingUpdate }] = useUpdateEnquiryMutation();

 

  const handleClose = () => setShow(false);
  const handleShow = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShow(true);
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const res = await deleteEnquiry(id).unwrap();
        toast.success(res.message);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const editEnquiryHandler = async (id) => {
    if (id) {
      try {
        const res = await updateEnquiry(id).unwrap();
        toast.success(res.message);
        handleClose();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleFilterChange = () => {
    // The query hook will automatically re-run with new query parameters
    refetch();
  };

  return (
    <>
      <Row className='align-items-center'>
      <h3 className='text-center text-success'>Enquiries</h3>
      <Col md={2} className='mb-3'>
      <Form>
      <Form.Group controlId="Status">
            <Form.Label  className="me-2 fw-bold">Message Status</Form.Label>
            <Form.Control
              as="select"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                handleFilterChange();
              }}
              className="mr-3"
            >
              <option value="">Filter message</option>
              <option value="submitted" className={status === 'submitted' ? 'bg-primary' : ''}>Submitted</option>
              <option value="resolved" className={status === 'resolved' ? 'bg-primary' : ''}>Resolved</option>
            </Form.Control>
          </Form.Group>
        
      </Form>
          
        </Col>
        
       
      </Row>

      {loadingDelete && <Loader />}
      {loadingUpdate && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>PHONE NO</th>
                <th>STATUS</th>
                <th>ACTION</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e) => (
                <tr key={e._id}>
                  <td>{e._id.toString().substring(0, 7)}</td>
                  <td>{e.name}</td>
                  <td><a href={`mailto:${e.email}`}>{e.email}</a></td>
                  <td><a href={`tel:${e.mobile}`}>{e.mobile}</a></td>
                  <td>{e.status}</td>
                  <td>
                    <Button
                      onClick={() => handleShow(e)}
                      variant='light'
                      className='btn-sm mx-2'
                    >
                      <GrFormView className='fs-3'/>
                    </Button>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(e._id)}
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

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body>
          {selectedEnquiry && (
            <Card>
              <Card.Header className='fw-bold text-center text-success '>
                Enquiry Details
              </Card.Header>
              <Card.Body>
                <Card.Text><strong>Name:</strong> {selectedEnquiry.name}</Card.Text>
                <Card.Text><strong>Email:</strong> <a href={`mailto:${selectedEnquiry.email}`}>{selectedEnquiry.email}</a></Card.Text>
                <Card.Text><strong>Phone No:</strong> <a href={`mailto:${selectedEnquiry.mobile}`}>{selectedEnquiry.mobile}</a></Card.Text>
                <hr />
                <Card.Text > <strong>Message:</strong> {selectedEnquiry.message}</Card.Text>
                <Button
                variant="primary"
                onClick={() => editEnquiryHandler(selectedEnquiry._id)}
                className='btn-sm me-auto ms-auto d-block'
              >
                Update
              </Button>
              </Card.Body>
              
            </Card>
          )}
        </Modal.Body>
      </Modal>
      <Paginate totalPages={data?.totalPages} page={data?.page} allEnquires={true} keyword={keyword}/>
    </>
  );
};

export default AllEnquiriesScreen;
