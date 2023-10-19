import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import BackButton from '../../components/UI/Button/BackButton';
import SizeCard from '../../components/Settings/Size/SizeCard';
import Modal from '../../components/UI/Modal/Modal';
import ErrorPage from '../../components/UI/ErrorPage/ErrorPage';
import SizeForm from '../../components/Settings/Size/SizeForm';

import {
  useGetAllSizesQuery,
  useCreateSizeMutation,
  useDeleteSizeMutation,
  useUpdateSizeMutation,
} from '../../features/slices/sizeApiSlice';

const SizePage = () => {
  const closeAddBtnRef = useRef(null);
  const closeDeleteBtnRef = useRef(null);
  const [action, setAction] = useState('');
  const [currentSize, setCurrentSize] = useState(null);
  const [sizeId, setSizeId] = useState('');

  const {
    data: sizesData,
    isError: sizesIsError,
    error: sizesError,
  } = useGetAllSizesQuery();

  const [
    createSize,
    {
      isSuccess: createSizeSuccess,
      isError: createSizeIsError,
      error: createSizeError,
    },
  ] = useCreateSizeMutation();

  const [
    deleteSize,
    {
      isSuccess: deleteSizeSuccess,
      isError: deleteSizeIsError,
      error: deleteSizeError,
    },
  ] = useDeleteSizeMutation();

  const [
    updateSize,
    {
      isSuccess: updateSizeSuccess,
      isError: updateSizeIsError,
      error: updateSizeError,
    },
  ] = useUpdateSizeMutation();

  const formik = useFormik({
    initialValues: {
      value: currentSize || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      value: Yup.number().required('Required'),
    }),
    onSubmit: (values) => {
      if (action === 'ADD') {
        createSize(values)
          .unwrap()
          .then(() => {
            formik.resetForm();
            closeAddBtnRef.current.click();
            toast.success('Size created successfully');
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
        updateSize({ sizeData: values, sizeId })
          .unwrap()
          .then(() => {
            formik.resetForm();
            closeAddBtnRef.current.click();
            toast.success('Size updated successfully');
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
    if (sizesIsError) {
      if (sizesError.data?.msg) {
        toast.error(sizesError.data.msg.split(',')[0]);
      } else {
        toast.error('Something went wrong, please try again');
      }
    }
  }, [sizesError, sizesIsError]);

  if (sizesIsError) {
    return <ErrorPage />;
  }

  const deleteSizeHandler = (e) => {
    e.preventDefault();
    deleteSize(sizeId)
      .unwrap()
      .then(() => {
        closeDeleteBtnRef.current.click();
        toast.success('Size deleted successfully');
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
    setSizeId(id);
  };

  const onAddHandler = () => {
    setAction('ADD');
    setSizeId('');
    setCurrentSize(null);
  };

  const onEditHandler = ({ id, value }) => {
    setAction('UPDATE');
    setSizeId(id);
    setCurrentSize(value);
  };

  return (
    <section className='h-100 d-flex flex-column gap-2'>
      <BackButton className='align-self-start' />
      <SizeCard
        buttonProps={{
          'data-bs-toggle': 'modal',
          'data-bs-target': '#addSizeForm',
        }}
        deleteButtonProps={{
          'data-bs-toggle': 'modal',
          'data-bs-target': '#deleteSizeModal',
        }}
        sizes={sizesData?.sizes || []}
        onAdd={onAddHandler}
        onDelete={onDeleteHandler}
        onEdit={onEditHandler}
      />

      <Modal
        onSubmit={formik.handleSubmit}
        id='addSizeForm'
        title='Add Size'
        ref={closeAddBtnRef}
      >
        <SizeForm formik={formik} />
      </Modal>
      <Modal
        onSubmit={deleteSizeHandler}
        id='deleteSizeModal'
        title='Delete Size'
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

export default SizePage;
