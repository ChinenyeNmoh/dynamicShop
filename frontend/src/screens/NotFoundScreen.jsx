import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFoundScreen = () => {
    return (
        <section className='text-center'>
          <FaExclamationTriangle className=' mt-4 mb-4 yellow' />
          <h1 className=' heading fw-bolder mb-4 text-dark'>404 Not Found</h1>
          <h4 className=' mb-5'>This page does not exist</h4>
          <Link
            to='/'
            className='text-white bg-indigo-700 hover:bg-indigo-900 rounded-md px-3 py-2 mt-4'
          >
            Go Back
          </Link>
        </section>
      );
}

export default NotFoundScreen