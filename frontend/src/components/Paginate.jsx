import PropTypes from 'prop-types';
import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Paginate = ({
  totalPages,
  page,
  keyword = "",
  allUsers = false,
  allProducts = false,
  allEnquires = false,
  allOrders = false,
  adminProducts = false,
  category = '',
  productType = '',
  sale = '',
}) => {
  if (totalPages <= 1) return null;
  console.log(`page = ${page} keyword = ${keyword}`);

  const getUrl = (pageNumber) => {
    const params = new URLSearchParams();

    if (category) params.append('category', category);
    if (productType) params.append('productType', productType);
    if (sale) params.append('sale', sale);

    let queryString = params.toString();
    if (queryString) queryString = `?${queryString}`;

    if (allUsers) return keyword ? `/admin/users/${keyword}/${pageNumber}${queryString}` : `/admin/users/${pageNumber}${queryString}`;
    if (allEnquires) return keyword ? `/admin/enquires/${keyword}/${pageNumber}${queryString}` : `/admin/enquires/${pageNumber}${queryString}`;
    if (allOrders) return keyword ? `/admin/orders/${keyword}/${pageNumber}${queryString}` : `/admin/orders/${pageNumber}${queryString}`;
    if (adminProducts) return keyword ? `/admin/products/${keyword}/${pageNumber}${queryString}` : `/admin/products/${pageNumber}${queryString}`;
    if (allProducts) return keyword ? `/allproducts/${keyword}/${pageNumber}${queryString}` : `/allproducts/${pageNumber}${queryString}`;
    
    return `/allproducts/${pageNumber}${queryString}`;
  };

  return (
    <Pagination>
      {[...Array(totalPages).keys()].map(x => (
        <Pagination.Item
          as={Link}
          key={x + 1}
          to={getUrl(x + 1)}
          active={x + 1 === page}
        >
          {x + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  );
};

Paginate.propTypes = {
  totalPages: PropTypes.number.isRequired,
  keyword: PropTypes.string,
  page: PropTypes.number.isRequired,
  allUsers: PropTypes.bool,
  allProducts: PropTypes.bool,
  allEnquires: PropTypes.bool,
  allOrders: PropTypes.bool,
  adminProducts: PropTypes.bool,
  category: PropTypes.string,
  productType: PropTypes.string,
  sale: PropTypes.string,
};

export default Paginate;
