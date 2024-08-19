import React, { useEffect, useContext } from 'react';

import { Button } from '@mui/material';

import { MyContext } from 'src/Context';
import { getOrders } from 'src/services/api';

const Orders = () => {
  const { orders, setOrders } = useContext(MyContext);

  useEffect(() => {
    const func = async () => {
      const ordersArg = await getOrders();
      setOrders(ordersArg.filter((order) => order.status !== 'COMPLETED'));
    };
    func();
  }, [setOrders]);

  // Group orders by table number
  const groupedOrders = orders.reduce((acc, order) => {
    const { table } = order;
    if (!acc[table]) {
      acc[table] = [];
    }
    acc[table].push(order);
    return acc;
  }, {});

  return (
    <div style={{ padding: '0 2vw' }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Orders</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: '1rem',
        }}
      >
        {Object.entries(groupedOrders).map(([tableNumber, orderList]) => (
          <div
            key={tableNumber}
            style={{
              border: '1px solid #e5e7eb',
              padding: '1rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              fontSize: '0.7rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Table {tableNumber}</span>
            </div>
            {orderList.map((order) => (
              <div
                key={order.orderID}
                style={{
                  marginBottom: '1rem',
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                }}
              >
                <div>
                  <strong>Order Details:</strong>
                  {order.orderDetails.map(({ dish, qty, numSplitters }) => (
                    <div
                      key={dish?._id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        width: '100%',
                        gap: '0.375rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                        <img
                          src={dish?.image || '/assets/lasagna.png'}
                          alt={dish?.name}
                          width={45}
                          height={45}
                          style={{ borderRadius: '0.5rem', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1 }}>
                          <p
                            style={{
                              fontFamily: 'sans-serif',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              textTransform: 'capitalize',
                              margin: '0',
                            }}
                          >
                            {dish?.name}
                          </p>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'start',
                              gap: '0.5rem',
                              marginTop: '0.25rem',
                              flexDirection: 'column',
                            }}
                          >
                            <p
                              style={{
                                fontFamily: 'sans-serif',
                                fontSize: '0.6rem',
                                fontWeight: '300',
                                margin: '0',
                              }}
                            >
                              ₹{dish.price * qty}
                            </p>
                            <p
                              style={{
                                fontFamily: 'sans-serif',
                                fontSize: '0.6rem',
                                fontWeight: '300',
                                margin: '0',
                              }}
                            >
                              No. of splitters: {numSplitters}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
                      >
                        <img
                          src={`/assets/${dish?.veg ? 'veg' : 'non-veg'}-icon.png`}
                          alt="veg-non-veg"
                          style={{ width: '15px', height: '15px' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p>
                  <strong>Amount:</strong> ₹{order.amount}
                </p>
                <p>
                  <strong>Remaining Amount:</strong> ₹{order.remainingAmount}
                </p>
                <p>
                  <strong>Date:</strong>{' '}
                  {`${new Date(order.date).toLocaleDateString(undefined, {
                    weekday: 'long', // 'Monday'
                    day: 'numeric', // '17'
                    month: 'short', // 'Aug'
                    year: 'numeric', // '2024'
                  })}, ${new Date(order.date).toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}`}
                </p>
                <Button color="primary" variant="contained" sx={{ fontSize: '0.7rem' }}>
                  Done!
                </Button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
