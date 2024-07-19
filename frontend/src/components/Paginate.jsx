import PropTypes from 'prop-types';
import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Paginate = ({
  totalPages,
  keyword = "",
  page,
  allUsers = false,
  allProducts = false,
  allEnquires = false,
  allOrders = false,
  adminProducts = false
}) => {
  if (totalPages <= 1) return null;
  console.log(`page = ${page} keyword = ${keyword}`);

  const getUrl = (pageNumber) => {
    if (allUsers) {
      return keyword ? `/admin/users/${keyword}/${pageNumber}` : `/admin/users/${pageNumber}`;
    }
    if (allEnquires) {
      return keyword ? `/admin/enquires/${keyword}/${pageNumber}` : `/admin/enquires/${pageNumber}`;
    }
    if (allOrders) {
      return keyword ? `/admin/orders/${keyword}/${pageNumber}` : `/admin/orders/${pageNumber}`;
    }
    if (adminProducts) {
      return keyword ? `/admin/products/${keyword}/${pageNumber}` : `/admin/products/${pageNumber}`;
    }
    if (allProducts) {
      return keyword ? `/${keyword}/${pageNumber}` : `/${pageNumber}`;
    }
    return `/${pageNumber}`;
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
  adminProducts: PropTypes.bool
};

Paginate.defaultProps = {
  keyword: "",
  allUsers: false,
  allProducts: false,
  allEnquires: false,
  allOrders: false,
  adminProducts: false
};

export default Paginate;
