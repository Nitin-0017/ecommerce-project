
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';


const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, subTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addOrder } = useOrders();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<'creditCard' | 'razorpay'>('creditCard');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      email: user?.email || '',
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || ''
    }
  });

  // Calculate shipping fee
  const shippingFee = subTotal > 50 ? 0 : 10;
  
  // Calculate tax (e.g., 8%)
  const tax = subTotal * 0.08;
  
  // Calculate total
  const total = subTotal + shippingFee + tax;

  const processRazorpayPayment = async () => {
    // Simulate Razorpay payment gateway
    return new Promise<{ id: string }>((resolve) => {
      setTimeout(() => {
        resolve({ id: 'rzp_' + Math.random().toString(36).substring(2, 15) });
      }, 1500);
    });
  };

  const processOrder = async (data) => {
    setIsProcessing(true);
    try {
      let paymentId = '';
      
      // Simulate payment processing
      if (paymentMethod === 'razorpay') {
        const payment = await processRazorpayPayment();
        paymentId = payment.id;
      } else {
        // Simulate credit card processing
        paymentId = 'cc_' + Math.random().toString(36).substring(2, 15);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Create order
      const order = addOrder({
        userId: user?.id || 'guest',
        items: items.map(item => ({
          product: item,
          quantity: item.quantity,
          price: item.price
        })),
        total,
        status: 'processing',
        shippingAddress: {
          name: `${data.firstName} ${data.lastName}`,
          line1: data.address,
          city: data.city,
          state: data.state,
          postalCode: data.zipCode,
          country: data.country
        },
        paymentMethod,
        paymentId
      });
      
      // Clear the cart
      clearCart();
      
      toast({
        title: "Order Placed Successfully!",
        description: "Thank you for your purchase.",
      });
      
      // Redirect to order confirmation
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit(processOrder)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping and Payment Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name*
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className={`w-full p-2 border rounded-md ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('firstName', { required: true })}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">First name is required</p>}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className={`w-full p-2 border rounded-md ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('lastName', { required: true })}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">Last name is required</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address*
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('email', { 
                      required: true,
                      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                    })}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">Valid email is required</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address*
                  </label>
                  <input
                    type="text"
                    id="address"
                    className={`w-full p-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('address', { required: true })}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">Address is required</p>}
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City*
                  </label>
                  <input
                    type="text"
                    id="city"
                    className={`w-full p-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('city', { required: true })}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">City is required</p>}
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province*
                  </label>
                  <input
                    type="text"
                    id="state"
                    className={`w-full p-2 border rounded-md ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('state', { required: true })}
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">State is required</p>}
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Zip/Postal Code*
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    className={`w-full p-2 border rounded-md ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('zipCode', { required: true })}
                  />
                  {errors.zipCode && <p className="text-red-500 text-xs mt-1">Zip code is required</p>}
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country*
                  </label>
                  <select
                    id="country"
                    className={`w-full p-2 border rounded-md ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('country', { required: true })}
                  >
                    <option value="">Select a country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="IN">India</option>
                  </select>
                  {errors.country && <p className="text-red-500 text-xs mt-1">Country is required</p>}
                </div>
              </div>
            </div>
            
            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('creditCard')}
                    className={`border rounded-md px-4 py-3 flex flex-1 items-center ${
                      paymentMethod === 'creditCard' ? 'border-brand-purple bg-purple-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="w-8 h-6 mr-2 flex items-center justify-center">
                      <img src="https://www.svgrepo.com/show/328132/credit-card.svg" alt="Credit Card" className="h-6 w-auto" />
                    </div>
                    <span>Credit Card</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`border rounded-md px-4 py-3 flex flex-1 items-center ${
                      paymentMethod === 'razorpay' ? 'border-brand-purple bg-purple-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="w-8 h-6 mr-2 flex items-center justify-center">
                      <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="h-6 w-auto" />
                    </div>
                    <span>Razorpay</span>
                  </button>
                </div>
                
                {paymentMethod === 'creditCard' && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                        Name on Card*
                      </label>
                      <input
                        type="text"
                        id="cardName"
                        className={`w-full p-2 border rounded-md ${errors.cardName ? 'border-red-500' : 'border-gray-300'}`}
                        {...register('cardName', { required: paymentMethod === 'creditCard' })}
                      />
                      {errors.cardName && <p className="text-red-500 text-xs mt-1">Name on card is required</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number*
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        placeholder="XXXX XXXX XXXX XXXX"
                        className={`w-full p-2 border rounded-md ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                        {...register('cardNumber', { 
                          required: paymentMethod === 'creditCard',
                          pattern: /^[0-9]{16}$/
                        })}
                      />
                      {errors.cardNumber && <p className="text-red-500 text-xs mt-1">Valid 16-digit card number is required</p>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date*
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          placeholder="MM/YY"
                          className={`w-full p-2 border rounded-md ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                          {...register('expiryDate', { 
                            required: paymentMethod === 'creditCard',
                            pattern: /^(0[1-9]|1[0-2])\/[0-9]{2}$/
                          })}
                        />
                        {errors.expiryDate && <p className="text-red-500 text-xs mt-1">Valid expiry date (MM/YY) is required</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                          CVV*
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          placeholder="123"
                          className={`w-full p-2 border rounded-md ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                          {...register('cvv', { 
                            required: paymentMethod === 'creditCard',
                            pattern: /^[0-9]{3,4}$/
                          })}
                        />
                        {errors.cvv && <p className="text-red-500 text-xs mt-1">Valid CVV is required</p>}
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'razorpay' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-md">
                    <p className="text-sm text-gray-700">
                      You will be redirected to the Razorpay payment gateway to complete your payment securely.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <span className="bg-gray-200 text-gray-700 rounded-full h-5 w-5 flex items-center justify-center mr-2 text-xs">
                        {item.quantity}
                      </span>
                      <span className="line-clamp-1">{item.title}</span>
                    </div>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-3">
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
              </div>
              
              <div className="border-t border-gray-200 mt-4 pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-brand-orange hover:bg-orange-600 text-white py-3"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
