
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, Clock, ArrowRight, Search } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

const OrdersPage = () => {
  const { getUserOrders } = useOrders();
  const { user, isAuthenticated } = useAuth();
  
  const orders = isAuthenticated && user ? getUserOrders(user.id) : [];

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-lg mx-auto">
          <ShoppingBag size={64} className="mx-auto text-gray-300" />
          <h2 className="text-2xl font-bold mt-4 mb-2">Please Log In</h2>
          <p className="text-gray-600 mb-8">You need to be logged in to view your orders.</p>
          <Link to="/login">
            <Button className="bg-brand-purple hover:bg-brand-dark-purple">
              Log In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-lg mx-auto">
          <Package size={64} className="mx-auto text-gray-300" />
          <h2 className="text-2xl font-bold mt-4 mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-8">You haven't placed any orders yet. Start shopping to see your orders here!</p>
          <Link to="/products">
            <Button className="bg-brand-purple hover:bg-brand-dark-purple">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Sort orders by date (newest first)
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="p-6 space-y-6">
          {sortedOrders.map(order => {
            // Format date
            const orderDate = new Date(order.createdAt);
            const formattedDate = orderDate.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            
            return (
              <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order placed</p>
                    <p className="font-medium">{formattedDate}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">#{order.id.slice(-8)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                  </div>
                  
                  <div className="ml-auto">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3 space-y-4">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4">
                            <img
                              src={item.product.image}
                              alt={item.product.title}
                              className="h-full w-full object-contain object-center"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium line-clamp-1">{item.product.title}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-sm text-gray-500">
                          + {order.items.length - 3} more item(s)
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col justify-center items-start">
                      <Link to={`/order-confirmation/${order.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center">
                          View Details
                          <ArrowRight size={14} className="ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
