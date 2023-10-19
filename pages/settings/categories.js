import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import BackButton from '../../components/UI/Button/BackButton';
import CategoryCard from '../../components/Settings/Category/CategoryCard';
import Modal from '../../components/UI/Modal/Modal';
import ErrorPage from '../../components/UI/ErrorPage/ErrorPage';
import CategoryForm from '../../components/Settings/Category/CategoryForm';

import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from '../../features/slices/categoryApiSlice';

const CategoryPage = () => {
  const closeAddBtnRef = useRef(null);
  const closeDeleteBtnRef = useRef(null);
  const [action, setAction] = useState('');
  const [currentCategory, setCurrentCategory] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const {
    data: categoriesData,
    isError: categoriesIsError,
    error: categoriesError,
  } = useGetAllCategoriesQuery();

  const [
    createCategory,
    {
      isSuccess: createCategorySuccess,
      isError: createCategoryIsError,
      error: createCategoryError,
    },
  ] = useCreateCategoryMutation();

  const [
    deleteCategory,
    {
      isSuccess: deleteCategorySuccess,
      isError: deleteCategoryIsError,
      error: deleteCategoryError,
    },
  ] = useDeleteCategoryMutation();

  const [
    updateCategory,
    {
      isSuccess: updateCategorySuccess,
      isError: updateCategoryIsError,
      error: updateCategoryError,
    },
  ] = useUpdateCategoryMutation();

  const formik = useFormik({
    initialValues: {
      name: currentCategory,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(3, 'Must be minimum 3 characters')
        .max(20, 'Must not be more than 20 characters')
        .required('Required'),
    }),
    onSubmit: (values) => {
      if (action === 'ADD') {
        createCategory(values)
          .unwrap()
          .then(() => {
            formik.resetForm();
            closeAddBtnRef.current.click();
            toast.success('Category created successfully');
          })
          .catch((error) => {
            if (error.data?.msg) {
              toast.error(error.data.msg.split(',')[0]);
            } else {
              toast.error('Something went wrong!, please try again');
            }
          });
      }

      if (action === 'UPDATE') {
        updateCategory({ categoryData: values, categoryId })
          .then(() => {
            formik.resetForm();
            closeAddBtnRef.current.click();
            toast.success('Category updated successfully');
          })
          .catch((error) => {
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
    if (categoriesIsError) {
      if (categoriesError.data?.msg) {
        toast.error(categoriesError.data.msg.split(',')[0]);
      } else {
        toast.error('Something went wrong, please try again');
      }
    }
  }, [categoriesError, categoriesIsError]);

  if (categoriesIsError) {
    return <ErrorPage />;
  }

  const deleteCategoryHandler = (e) => {
    e.preventDefault();
    deleteCategory(categoryId)
      .unwrap()
      .then(() => {
        closeDeleteBtnRef.current.click();
        toast.success('Category deleted successfully');
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
    setCategoryId(id);
  };

  const onAddHandler = () => {
    setAction('ADD');
    setCategoryId('');
    setCurrentCategory('');
  };

  const onEditHandler = ({ id, name }) => {
    setAction('UPDATE');
    setCategoryId(id);
    setCurrentCategory(name);
  };

  return (
    <section className='h-100 d-flex flex-column gap-2'>
      <BackButton className='align-self-start' />
      <CategoryCard
        buttonProps={{
          'data-bs-toggle': 'modal',
          'data-bs-target': '#addCategoryForm',
        }}
        deleteButtonProps={{
          'data-bs-toggle': 'modal',
          'data-bs-target': '#deleteCategoryModal',
        }}
        categories={categoriesData?.categories || []}
        onAdd={onAddHandler}
        onDelete={onDeleteHandler}
        onEdit={onEditHandler}
      />

      <Modal
        onSubmit={formik.handleSubmit}
        id='addCategoryForm'
        title='Add Category'
        ref={closeAddBtnRef}
      >
        <CategoryForm formik={formik} />
      </Modal>
      <Modal
        onSubmit={deleteCategoryHandler}
        id='deleteCategoryModal'
        title='Delete Category'
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

export default CategoryPage;
