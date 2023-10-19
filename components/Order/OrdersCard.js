const OrdersCard = (props) => {
  const { orders, totalOrders } = props;

  return (
    <div className='row'>
      <div className='fs-8'>
        <div className='card'>
          <div className='card-header d-flex align-items-center justify-content-between'>
            <h4 className='card-title'>{`Users (${totalOrders})`}</h4>
          </div>
          <div className='card-body'>
            <div className='d-flex flex-column gap-3'>
              {orders.length ? (
                <table className='table'>
                  <thead>
                    <tr>
                      <th scope='col' className='text-center'>
                        Order ID
                      </th>
                      <th scope='col' className='text-center'>
                        Discount
                      </th>
                      <th scope='col' className='text-center'>
                        Sub Total
                      </th>
                      <th scope='col' className='text-center'>
                        Total
                      </th>
                      <th scope='col' className='text-center'>
                        Paid
                      </th>
                      <th scope='col' className='text-center'>
                        Delivered
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      return (
                        <tr key={order.orderId}>
                          <td className='text-center'>{order.id}</td>
                          <td className='text-center'>{order.discount}</td>
                          <td className='text-center'>{order.subTotal}</td>
                          <td className='text-center'>{order.total}</td>
                          <td className='text-center'>
                            {order.isPaid ? (
                              <span className='text-success'>
                                <i className='bi bi-check2'></i>
                              </span>
                            ) : (
                              <span className='text-danger'>
                                <i className='bi bi-x-lg'></i>
                              </span>
                            )}
                          </td>
                          <td className='text-center'>
                            {order.isDelivered ? (
                              <span className='text-success'>
                                <i className='bi bi-check2'></i>
                              </span>
                            ) : (
                              <span className='text-danger'>
                                <i className='bi bi-x-lg'></i>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <span>No orders found</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersCard;
