import styles from './OrdersFilter.module.css';

const sortType = [
  {
    id: 1,
    value: 'latest',
    name: 'Latest',
  },
  {
    id: 2,
    value: 'oldest',
    name: 'Oldest',
  },
];

const priceSortType = [
  {
    id: 1,
    value: '',
    name: 'Select',
  },
  {
    id: 2,
    value: 'highest',
    name: 'High-Low',
  },
  {
    id: 3,
    value: 'lowest',
    name: 'Low-High',
  },
];

const statusType = [
  {
    id: 1,
    value: '',
    name: 'All',
  },
  {
    id: 2,
    value: 1,
    name: 'Paid',
  },
  {
    id: 3,
    value: 0,
    name: 'Pending',
  },
];

const OrdersFilterForm = (props) => {
  const { queries, setQueries } = props;

  const filterChangeHandler = (e) => {
    setQueries((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
        page: 1,
      };
    });
  };

  const clearFiltersHandler = () => {
    setQueries({
      sort: '',
      priceSort: '',
      status: '',
      page: 1,
    });
  };

  return (
    <div className='card mb-3'>
      <div className='card-body'>
        <div className='row gy-2'>
          <div className='col-4'>
            <label htmlFor='sort' className='form-label'>
              Sort
            </label>
            <select
              value={queries.sort}
              onChange={filterChangeHandler}
              name='sort'
              id='sort'
              className='form-select'
            >
              {sortType.map((option) => {
                return (
                  <option key={option.id} value={option.value}>
                    {option.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className='col-4'>
            <label htmlFor='priceSort' className='form-label'>
              Price
            </label>
            <select
              value={queries.priceSort}
              onChange={filterChangeHandler}
              name='priceSort'
              id='priceSort'
              className='form-select'
            >
              {priceSortType.map((option) => {
                return (
                  <option key={option.id} value={option.value}>
                    {option.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className='col-4'>
            <label htmlFor='status' className='form-label'>
              Status
            </label>
            <select
              value={queries.status}
              onChange={filterChangeHandler}
              name='status'
              id='status'
              className='form-select'
            >
              {statusType.map((option) => {
                return (
                  <option key={option.id} value={option.value}>
                    {option.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className='col-4'>
            <button
              onClick={clearFiltersHandler}
              className={`btn btn-primary btn-sm w-100 ${styles.filterBtn}`}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersFilterForm;
