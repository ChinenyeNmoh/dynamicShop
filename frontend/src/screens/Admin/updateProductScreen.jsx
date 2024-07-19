import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useUpdateProductMutation, useGetProductDetailsQuery, useUploadImageMutation } from '../../slices/productSlice';
import { useGetCategoriesQuery } from '../../slices/categoryApiSlice';
import { useGetTypesQuery } from '../../slices/typeApiSlice';

const UpdateProductScreen = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [productType, setProductType] = useState('');
  const [price, setPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [sold, setSold] = useState('');
  const [images, setImages] = useState('');
  const [totalRating, setTotalRating] = useState('');
  const [previewImgUrl, setPreviewimgUrl] = useState("");


  const { data, isLoading, error, refetch } = useGetProductDetailsQuery(id);
  const { data: categoryData } = useGetCategoriesQuery();
  const categories = categoryData?.categories || [];
  const { data: typeData } = useGetTypesQuery();
  const types = typeData?.types || [];
  const product = data?.product;

  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadImage, { isLoading: loadingUpload }] = useUploadImageMutation();

  const navigate = useNavigate();

  

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProduct({
        id,
        name,
        description,
        price,
        discountedPrice,
        category,
        productType,
        sold,
        totalRating,
        quantity,
        images,
      }).unwrap();
      toast.success(res.message);
      refetch();
      navigate('/admin/products');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setCategory(product.category);
      setProductType(product.productType);
      setPrice(product.price);
      setDiscountedPrice(product.discountedPrice);
      setQuantity(product.quantity);
      setImages(product.images[0].url);
      setTotalRating(product.totalRating);
      setSold(product.sold);
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    try {
      const f = e.target.files[0];
      const res = await uploadImage(f).unwrap();
      setImages(res.imageUrls[0].url);
      refetch();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to='/admin/products' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h3 className='text-center text-success mt-3'>Edit Product</h3>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error?.data?.message || error.error}</Message>
        ) : (
          <Form className='m-3' onSubmit={submitHandler} encType="multipart/form-data">
            <Row>
              <Col md={6}>
                <Form.Group className='my-2' controlId='name'>
                  <Form.Label className='fw-bold'>Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className='my-2' controlId='totalRating'>
                  <Form.Label className='fw-bold'>Total Rating</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Enter total rating'
                    value={totalRating}
                    disabled={true}
                    onChange={(e) => setTotalRating(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className='my-2' controlId='description'>
                  <Form.Label className='fw-bold'>Description</Form.Label>
                  <Form.Control
                    as='textarea'
                    placeholder='Enter product description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className='my-2' controlId='price'>
                  <Form.Label className='fw-bold'>Price</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Enter price'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className='my-2' controlId='discountedPrice'>
                  <Form.Label className='fw-bold'>Discounted Price</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Enter discounted price'
                    value={discountedPrice}
                    onChange={(e) => setDiscountedPrice(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className='my-2' controlId='category'>
                  <Form.Label className='fw-bold'>Category</Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value=''>Select category</option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className='my-2' controlId='productType'>
                  <Form.Label className='fw-bold'>Product Type</Form.Label>
                  <Form.Select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                  >
                    <option value=''>Select product type</option>
                    {types?.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className='my-2' controlId='quantity'>
                  <Form.Label className='fw-bold'>Quantity</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Enter quantity'
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className='my-2' controlId='sold'>
                  <Form.Label className='fw-bold'>Number Sold</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Enter number sold'
                    value={sold}
                    disabled={true}
                    onChange={(e) => setSold(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className='my-2' controlId='images'>
                  <Form.Label className='fw-bold'>Images</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter image URLs'
                    value={images}
                    onChange={(e) => setImages(e.target.value)}
                    className='mb-2'
                  ></Form.Control>
                  <Form.Control
                    label='Choose File'
                    onChange={uploadFileHandler}
                    accept='image/*'
                    type='file'
                    name='images'
                  ></Form.Control>
                  {loadingUpload && <Loader />}
                </Form.Group>
              </Col>
            </Row>
            <Button type='submit' variant='primary' className='d-block me-auto ms-auto mt-4'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UpdateProductScreen;
