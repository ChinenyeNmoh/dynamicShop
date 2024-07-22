import { Helmet } from 'react-helmet-async';

const Meta = ({ title='Welcome To dynamikShop', description='We sell the best products for cheap', keywords='kids fashion, toys, clothes, shoes, asseccories' }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

export default Meta;