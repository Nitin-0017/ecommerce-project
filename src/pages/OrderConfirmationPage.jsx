
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { Button } from '@/components/ui/button';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const { getOrderById } = useOrders();
  const navigate = useNavigate();
  
  const order = getOrderById(id || '');
  
  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);
  
  if (!order) {
    return null;
  }
  
  // Format date
  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const estimatedDelivery = new Date(orderDate);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
  const formattedDeliveryDate = estimatedDelivery.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-green-500 px-6 py-8 text-white text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16" />
          <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-white/90">Thank you for your purchase</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-1">Order Information</h3>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Order ID:</span> #{order.id.slice(-8)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Date:</span> {formattedDate}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Payment Method:</span> {order.paymentMethod === 'razorpay' ? 'Razorpay' : 'Credit Card'}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Order Status:</span> {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Estimated Delivery:</span> {formattedDeliveryDate}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-1">Shipping Address</h3>
              <p className="text-sm text-gray-600">{order.shippingAddress.name}</p>
              <p className="text-sm text-gray-600">{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && (
                <p className="text-sm text-gray-600">{order.shippingAddress.line2}</p>
              )}
              <p className="text-sm text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
            </div>
          </div>
          
          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="h-full w-full object-contain object-center"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product.title}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span>${(order.total * 0.92).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Shipping</span>
            <span>${(order.total * 0.08).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold mb-6">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/orders">
              <Button variant="outline">View All Orders</Button>
            </Link>
            <Link to="/products">
              <Button className="bg-brand-purple hover:bg-brand-dark-purple flex items-center">
                Continue Shopping
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
