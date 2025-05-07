
import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext(undefined);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Load orders from localStorage on initial render
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save orders to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: `order-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setOrders(prevOrders => [...prevOrders, newOrder]);
    return newOrder;
  };

  const getOrderById = (id) => {
    return orders.find(order => order.id === id);
  };

  const getUserOrders = (userId) => {
    return orders.filter(order => order.userId === userId);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      getOrderById,
      getUserOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
