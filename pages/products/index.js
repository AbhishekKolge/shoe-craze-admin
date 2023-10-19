import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import ProductCard from '../../components/Product/ProductCard';
import Modal from '../../components/UI/Modal/Modal';
import ErrorPage from '../../components/UI/ErrorPage/ErrorPage';
import ProductForm from '../../components/Product/ProductForm';
import ProductFilterForm from '../../components/Product/ProductFilterForm';
import Pagination from '../../components/UI/Pagination/Pagination';
import LoadingPage from '../../components/UI/LoadingPage/LoadingPage';

import {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from '../../features/slices/productApiSlice';
import { useGetAllCategoriesQuery } from '../../features/slices/categoryApiSlice';
import { useGetAllSizesQuery } from '../../features/slices/sizeApiSlice';

const ProductsPage = () => {
  const closeAddBtnRef = useRef(null);
  const closeDeleteBtnRef = useRef(null);
  const [action, setAction] = useState('');
  const [queries, setQueries] = useState({
    search: '',
    sort: 'latest',
    featured: '',
    categoryId: '',
    sizeId: '',
    priceSort: '',
    page: 1,
  });
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    price: '',
    discount: '',
    discountAmount: '',
    sizes: [],
    categoryId: '',
    featured: false,
    color: '#000000',
    description: '',
    inventory: '',
  });
  const [productId, setProductId] = useState('');

  const {
    data: categoriesData,
    isError: categoriesIsError,
    error: categoriesError,
  } = useGetAllCategoriesQuery();

  const {
    data: sizesData,
    isError: sizesIsError,
    error: sizesError,
  } = useGetAllSizesQuery();

  const {
    data: productsData,
    isError: productsIsError,
    error: productsError,
    isLoading: productsIsLoading,
  } = useGetAllProductsQuery({ ...queries });

  const [
    createProduct,
    {
      isSuccess: createProductSuccess,
      isError: createProductIsError,
      error: createProductError,
      isLoading: createProductLoading,
    },
  ] = useCreateProductMutation();

  const [
    deleteProduct,
    {
      isSuccess: deleteProductSuccess,
      isError: deleteProductIsError,
      error: deleteProductError,
    },
  ] = useDeleteProductMutation();

  const [
    updateProduct,
    {
      isSuccess: updateProductSuccess,
      isError: updateProductIsError,
      error: updateProductError,
      isLoading: updateProductLoading,
    },
  ] = useUpdateProductMutation();

  const formik = useFormik({
    initialValues: {
      image: '',
      name: currentProduct.name,
      price: currentProduct.price,
      discount: currentProduct.discount,
      discountAmount: currentProduct.discountAmount,
      sizes: currentProduct.sizes,
      categoryId: currentProduct.categoryId,
      featured: currentProduct.featured,
      color: currentProduct.color,
      description: currentProduct.description,
      inventory: currentProduct.inventory,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      image: action === 'ADD' ? Yup.mixed().required() : Yup.mixed().optional(),
      name: Yup.string().min(3).max(50).required(),
      price: Yup.number().min(100).required(),
      discount: Yup.string().oneOf(['PERCENTAGE', 'FIXED']).optional(),
      discountAmount: Yup.number().optional(),
      sizes: Yup.array().of(Yup.object().required()).min(1).required(),
      categoryId: Yup.string().required(),
      featured: Yup.boolean().optional(),
      color: Yup.string().required(),
      description: Yup.string().max(500).required(),
      inventory: Yup.number().integer().optional(),
    }),
    onSubmit: (values) => {
      const productDetails = { ...values };
      productDetails.sizes = productDetails.sizes.map((size) => size.id);
      productDetails.sizes = JSON.stringify(productDetails.sizes);
      const productFormData = new FormData();

      for (const key in productDetails) {
        if (productDetails[key] !== '' && productDetails[key] !== null) {
          productFormData.append(key, productDetails[key]);
        }
      }
      if (action === 'ADD') {
        const uploadingToast = toast.loading(
          'Creating product, please be patient'
        );
        createProduct(productFormData)
          .unwrap()
          .then(() => {
            toast.dismiss(uploadingToast);
            formik.resetForm();
            closeAddBtnRef.current.click();
            toast.success('Product created successfully');
          })
          .catch((error) => {
            toast.dismiss(uploadingToast);
            if (error.data?.msg) {
              toast.error(error.data.msg.split(',')[0]);
            } else {
              toast.error('Something went wrong!, please try again');
            }
          });
      }

      if (action === 'UPDATE') {
        const uploadingToast = toast.loading(
          'Updating product, please be patient'
        );
        updateProduct({ productData: productFormData, productId })
          .unwrap()
          .then(() => {
            toast.dismiss(uploadingToast);
            formik.resetForm();
            closeAddBtnRef.current.click();
            toast.success('Product updated successfully');
          })
          .catch((error) => {
            toast.dismiss(uploadingToast);
            if (error.data?.msg) {
              toast.error(error.data.msg.split(',')[0]);
            } else {
              toast.error('Something went wrong!, please try again');
            }
          });
      }
    },
  });

  useEffect(() => {
    if (productsIsError) {
      if (productsError.data?.msg) {
        toast.error(productsError.data.msg.split(',')[0]);
      } else {
        toast.error('Something went wrong, please try again');
      }
    }
  }, [productsError, productsIsError]);

  useEffect(() => {
    if (categoriesIsError) {
      if (categoriesError.data?.msg) {
        toast.error(categoriesError.data.msg.split(',')[0]);
      } else {
        toast.error('Something went wrong, please try again');
      }
    }
  }, [categoriesError, categoriesIsError]);

  useEffect(() => {
    if (sizesIsError) {
      if (sizesError.data?.msg) {
        toast.error(sizesError.data.msg.split(',')[0]);
      } else {
        toast.error('Something went wrong, please try again');
      }
    }
  }, [sizesError, sizesIsError]);

  if (productsIsLoading) {
    return <LoadingPage />;
  }
  if (productsIsError) {
    return <ErrorPage />;
  }

  const deleteProductHandler = (e) => {
    e.preventDefault();
    deleteProduct(productId)
      .unwrap()
      .then(() => {
        closeDeleteBtnRef.current.click();
        toast.success('Product deleted successfully');
      })
      .catch((error) => {
        if (error.data?.msg) {
          toast.error(error.data.msg.split(',')[0]);
        } else {
          toast.error('Something went wrong!, please try again');
        }
      });
  };

  const onDeleteHandler = (id) => {
    setProductId(id);
  };

  const onAddHandler = () => {
    setAction('ADD');
    setProductId('');
    setCurrentProduct({
      name: '',
      price: '',
      discount: '',
      discountAmount: '',
      sizes: [],
      categoryId: '',
      featured: false,
      color: '#000000',
      description: '',
      inventory: '',
    });
  };

  const onEditHandler = ({ id, productDetails }) => {
    setAction('UPDATE');
    setProductId(id);
    setCurrentProduct(productDetails);
  };

  return (
    <section className='h-100 d-flex flex-column gap-2'>
      <ProductFilterForm
        categories={categoriesData?.categories || []}
        sizes={sizesData?.sizes || []}
        queries={queries}
        setQueries={setQueries}
      />
      <ProductCard
        buttonProps={{
          'data-bs-toggle': 'modal',
          'data-bs-target': '#addProductForm',
        }}
        deleteButtonProps={{
          'data-bs-toggle': 'modal',
          'data-bs-target': '#deleteProductModal',
        }}
        products={productsData?.products || []}
        totalProducts={productsData?.totalProducts || 0}
        onAdd={onAddHandler}
        onDelete={onDeleteHandler}
        onEdit={onEditHandler}
      />
      <Pagination
        numOfPages={productsData?.numOfPages || 0}
        queries={queries}
        setQueries={setQueries}
      />

      <Modal
        onSubmit={formik.handleSubmit}
        size='modal-lg'
        id='addProductForm'
        title='Add Product'
        ref={closeAddBtnRef}
      >
        <ProductForm
          categories={categoriesData?.categories || []}
          sizes={sizesData?.sizes || []}
          formik={formik}
        />
      </Modal>
      <Modal
        onSubmit={deleteProductHandler}
        id='deleteProductModal'
        title='Delete Product'
        actionText='Delete'
        ref={closeDeleteBtnRef}
      >
        <span className='fs-6'>
          Are you sure? This action is not reversible.
        </span>
      </Modal>
    </section>
  );
};

export default ProductsPage;
