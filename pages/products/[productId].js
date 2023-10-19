import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { JsonViewer } from '@textea/json-viewer';

import { formatISTDateTime } from '../../helpers/time';

import BackButton from '../../components/UI/Button/BackButton';
import ErrorPage from '../../components/UI/ErrorPage/ErrorPage';
import LoadingPage from '../../components/UI/LoadingPage/LoadingPage';

import { useGetSingleProductQuery } from '../../features/slices/productApiSlice';

const ProductDetailsPage = () => {
  const router = useRouter();

  const {
    data: productData,
    isError: productIsError,
    error: productError,
    isLoading: productIsLoading,
  } = useGetSingleProductQuery(router.query.productId, {
    skip: !router.query?.productId,
  });

  useEffect(() => {
    if (productIsError) {
      if (productError.data?.msg) {
        toast.error(productError.data.msg.split(',')[0]);
      } else {
        toast.error('Something went wrong, please try again');
      }
    }
  }, [productError, productIsError]);

  if (productIsLoading) {
    return <LoadingPage />;
  }
  if (productIsError) {
    return <ErrorPage />;
  }

  return (
    <section className='h-100 d-flex flex-column gap-2'>
      <BackButton className='align-self-start' />
      <div className='row'>
        <div className='col-6'>
          <div className='card'>
            <div className='card-body'>
              <h3 className='text-uppercase fw-bold'>
                {productData?.product.name}
              </h3>
              <h4>₹ {productData?.product.price} /-</h4>
              <p>{productData?.product.description}</p>
              <h6 className='mt-6'>Details</h6>
              <ul className='list-group mt-3'>
                <li className='list-group-item d-flex align-items-center justify-content-between gap-3'>
                  <span>Featured</span>
                  <span>{productData?.product.featured ? 'Yes' : 'No'}</span>
                </li>
                <li className='list-group-item d-flex align-items-center justify-content-between gap-3'>
                  <span>Color</span>
                  <input
                    disabled
                    type='color'
                    value={productData?.product.color}
                  />
                </li>
                <li className='list-group-item d-flex align-items-center justify-content-between gap-3'>
                  <span>Stock</span>
                  <span className='badge rounded-pill text-bg-primary'>
                    {productData?.product.inventory}
                  </span>
                </li>
                <li className='list-group-item d-flex align-items-center justify-content-between gap-3'>
                  <span>Discount</span>
                  <span>
                    {productData?.product.discount === 'FIXED'
                      ? `₹ ${productData?.product.discountAmount}`
                      : `${productData?.product.discountAmount}%`}
                  </span>
                </li>
                <li className='list-group-item d-flex align-items-center justify-content-between gap-3'>
                  <span>Avg. rating</span>
                  <span className='badge rounded-pill text-bg-primary'>
                    {productData?.product.averageRating}
                  </span>
                </li>
                <li className='list-group-item d-flex align-items-center justify-content-between gap-3'>
                  <span>No of reviews</span>
                  <span className='badge rounded-pill text-bg-primary'>
                    {productData?.product.numOfReviews}
                  </span>
                </li>
                <li className='list-group-item d-flex align-items-center justify-content-between gap-3'>
                  <span>Category</span>
                  <span>{productData?.product.category.name}</span>
                </li>
                <li className='list-group-item d-flex align-items-center justify-content-between gap-3'>
                  <span>Created On</span>
                  <span>
                    {formatISTDateTime(productData?.product.createdAt)}
                  </span>
                </li>
                <li className='list-group-item d-flex align-items-center justify-content-between gap-3'>
                  <span>Updated On</span>
                  <span>
                    {formatISTDateTime(productData?.product.updatedAt)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className='col-6'>
          <div>
            <div className='card'>
              <div className='card-body'>
                <h3 className='text-uppercase fw-bold'>Variants</h3>
                <h4>Sizes</h4>
                <div className='d-flex align-items-center gap-2 mt-3'>
                  {productData?.product.sizes.map((size) => {
                    return (
                      <span
                        key={size.id}
                        className='badge text-bg-secondary fs-6'
                      >
                        {size.value}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <div className='card'>
              <div className='card-body'>
                <h3 className='text-uppercase fw-bold'>Images</h3>
                {productData?.product.image && (
                  <Image
                    src={productData?.product.image}
                    alt='product-image'
                    width={200}
                    height={200}
                    className='mt-2 img-thumbnail'
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='col-6 mt-4'>
          <div className='card'>
            <div className='card-body'>
              <h3 className='text-uppercase fw-bold mb-3'>Raw Product</h3>
              <JsonViewer
                displayDataTypes={false}
                editable={false}
                value={productData?.product}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsPage;
