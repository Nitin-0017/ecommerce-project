
import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const CartPage = () => {
  const { items, removeItem, updateQuantity, clearCart, subTotal } = useCart();
  const { toast } = useToast();

  const handleRemove = (id, title) => {
    removeItem(id);
    toast({
      title: "Item removed",
      description: `${title} has been removed from your cart.`,
    });
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };

  // Calculate shipping fee
  const shippingFee = subTotal > 50 ? 0 : 10;
  
  // Calculate tax (e.g., 8%)
  const tax = subTotal * 0.08;
  
  // Calculate total
  const total = subTotal + shippingFee + tax;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-lg mx-auto">
          <div className="p-6 mb-6">
            <ShoppingCart size={64} className="mx-auto text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products">
            <Button className="bg-brand-purple hover:bg-brand-dark-purple">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Cart Items ({items.length})</h2>
                <button 
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Clear Cart
                </button>
              </div>

              {/* Cart Items List */}
              <ul className="divide-y divide-gray-200">
                {items.map(item => (
                  <li key={item.id} className="py-6 flex flex-wrap md:flex-nowrap">
                    {/* Product Image */}
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain object-center"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <Link to={`/products/${item.id}`} className="hover:text-brand-purple">
                              {item.title}
                            </Link>
                          </h3>
                          <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 capitalize">{item.category}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="px-3 py-1 text-gray-600 hover:text-brand-purple"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 py-1 text-center w-10">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:text-brand-purple"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item.id, item.title)}
                          className="text-sm text-red-500 hover:text-red-700 flex items-center"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Continue Shopping Link */}
          <div className="mt-6">
            <Link to="/products" className="text-brand-purple hover:underline inline-flex items-center">
              <ArrowRight size={16} className="mr-2 rotate-180" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${subTotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                {shippingFee > 0 ? (
                  <span className="text-gray-900">${shippingFee.toFixed(2)}</span>
                ) : (
                  <span className="text-green-600">Free</span>
                )}
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="text-gray-900">${tax.toFixed(2)}</span>
              </div>
              
              <div className="h-px bg-gray-200 my-4"></div>
              
              <div className="flex justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold">${total.toFixed(2)}</span>
              </div>

              <Link to="/checkout" className="w-full">
                <Button className="w-full bg-brand-orange hover:bg-orange-600 text-white py-3 mt-6">
                  Proceed to Checkout
                </Button>
              </Link>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Taxes and shipping calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
