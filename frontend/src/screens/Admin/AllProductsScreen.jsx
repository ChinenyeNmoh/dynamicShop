import { Table, Button, Row, Col, Form, Modal } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation
} from '../../slices/productSlice';
import { toast } from 'react-toastify';
import { useState } from 'react';
import Paginate from '../../components/Paginate';

const AllProductsScreen = () => {
  const { page=1, keyword='' } = useParams();
  console.log(`page = ${page} keyword = ${keyword}`);
  const [sort, setSort] = useState('');
  const { data, isLoading, error, refetch } = useGetProductsQuery({sort, keyword, page});
  const [deleteProduct] = useDeleteProductMutation();
  const products = data?.products || [];
 
  

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        const res = await deleteProduct(id).unwrap();
        toast.success(res.message);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        const res = await createProduct().unwrap();
        toast.success(res.message);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
    <Row className='d-flex justify-content-between mb-5'>
            <Col sm={12} md={6} lg={4} xl={3} className='mt-5'>
              <Form>
                <Form.Group className='mb-3' controlId='sort'>
                  <Row>
                    <Col md={2}>
                    <Form.Label className='mt-2 fw-bold'>Sort</Form.Label>
                    </Col>
                    <Col>
                    <Form.Select
                    value={sort}
                    onChange={
                      (e) => setSort(e.target.value)
                    }
                  >
                    <option value=''>Default</option>
                    <option value='low' className={sort === 'low'? 'bg-primary': ''}>Lowest Price</option>
                    <option value='high' className={sort === 'high'? 'bg-primary': ''}>Highest Price</option>
                    <option value='old' className={sort === 'old'? 'bg-primary': ''}>Old</option>
                    <option value='alphabetical' className={sort === 'alphabetical'? 'bg-primary': ''}>Alphabetical</option>
                    <option value='rating' className={sort === 'rating'? 'bg-primary': ''}>Rating</option>
                    
                  </Form.Select>
                    </Col>
                    <Col md={3}>
                    <Button
                type='button'
                className='btn btn-secondary mb-3'
                onClick={() => setSort('')}
              >
                Reset
              </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Col>
            <Col sm={12} md={6} lg={4} xl={3} >
            <Button className='mt-5' onClick={createProductHandler}>
            <FaPlus /> Create Product
          </Button>
             
            </Col>
          </Row>

      {loadingCreate && <Loader />}
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
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>Type</th>
                <th>Actions</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id.toString().substring(0, 7)}>
                  <td>{product._id.toString().substring(0, 7)}</td>
                  <td>{product.name}</td>
                  <td>N{product.price}</td>
                  <td>{product?.category?.title}</td>
                  <td>{product?.productType?.title}</td>
                  <td>
                    <Button
                      as={Link}
                      to={`/admin/product/${product._id}/edit`}
                      variant='light'
                      className='btn-sm mx-2'
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Paginate totalPages={data?.totalPages} page={data?.page} adminProducts={true} keyword={keyword} />
      
        </>
      )}
    </>
  );
};

export default AllProductsScreen;