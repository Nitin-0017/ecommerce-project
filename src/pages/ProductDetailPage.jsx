
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { getProduct } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const productId = parseInt(id || '0');
  const [quantity, setQuantity] = useState(1);
  
  const { addItem } = useCart();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId),
    enabled: !!productId
  });

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      });
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center">
          <span className="loading">Loading product details...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-red-500">
          Error loading product. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/products" className="inline-flex items-center text-brand-purple hover:underline">
          <ArrowLeft size={16} className="mr-2" />
          Back to Products
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Image */}
          <div className="flex justify-center items-center bg-gray-50 rounded-lg p-8">
            <img 
              src={product.image} 
              alt={product.title} 
              className="max-h-80 object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    className={`${
                      index < Math.round(product.rating.rate)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">{product.rating.rate} ({product.rating.count} reviews)</span>
            </div>
            
            {/* Price */}
            <p className="text-3xl font-bold text-gray-900 mb-4">${product.price.toFixed(2)}</p>
            
            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            {/* Category */}
            <div className="mb-6">
              <span className="text-sm text-gray-500">Category: </span>
              <Link to={`/category/${product.category}`} className="text-brand-purple hover:underline capitalize">
                {product.category}
              </Link>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center mb-6">
              <span className="text-sm text-gray-700 mr-4">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={decrementQuantity}
                  className="px-3 py-2 text-gray-600 hover:text-brand-purple disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 text-center w-12">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="px-3 py-2 text-gray-600 hover:text-brand-purple"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <Button 
              onClick={handleAddToCart}
              className="bg-brand-purple hover:bg-brand-dark-purple text-white py-3 px-6 rounded-md flex items-center justify-center"
            >
              <ShoppingCart className="mr-2" size={18} />
              Add to Cart
            </Button>

            {/* Additional Info */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600 mb-2">• Free shipping on orders over $50</p>
              <p className="text-sm text-gray-600 mb-2">• Easy 30-day returns</p>
              <p className="text-sm text-gray-600">• Secure checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
