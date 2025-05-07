import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, ArrowRight, Star } from 'lucide-react';
import { getProducts, getCategories } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gray-100 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Discover Amazing Products For Your Lifestyle
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Shop the latest trends and find exactly what you need with our curated collection of high-quality products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <Button className="bg-brand-purple hover:bg-brand-dark-purple text-white px-8 py-3 rounded-md text-lg">
                  Shop Now
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="outline" className="border-brand-purple text-brand-purple hover:bg-gray-100 px-8 py-3 rounded-md text-lg">
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md animate-scale-in">
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-brand-purple rounded-full opacity-20"></div>
              <div className="absolute -bottom-8 -right-8 w-56 h-56 bg-brand-orange rounded-full opacity-20"></div>
              <img 
                src="https://img.freepik.com/free-photo/black-friday-elements-assortment_23-2149074076.jpg" 
                alt="Shopping experience" 
                className="relative z-10 w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  
  return (
    <div className="product-card group">
      <div className="product-card-image">
        <img 
          src={product.image} 
          alt={product.title} 
          className="h-full w-full object-contain transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{product.title}</h3>
        <div className="flex items-center mt-1">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={16}
                className={`${
                  index < Math.round(product.rating.rate)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">({product.rating.count})</span>
        </div>
        <p className="mt-2 text-xl font-semibold text-gray-900">${product.price.toFixed(2)}</p>
        <div className="mt-4 flex space-x-2">
          <Link 
            to={`/products/${product.id}`} 
            className="flex-1"
          >
            <Button variant="outline" className="w-full">View</Button>
          </Link>
          <Button 
            className="bg-brand-purple hover:bg-brand-dark-purple"
            onClick={() => addItem(product)}
          >
            <ShoppingCart size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

const FeaturedProducts = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  if (isLoading) {
    return <div className="flex justify-center py-12"><span className="loading">Loading products...</span></div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error loading products. Please try again later.</div>;
  }

  // Get 8 featured products
  const featuredProducts = products?.slice(0, 8);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link 
            to="/products"
            className="text-brand-purple font-medium hover:underline flex items-center"
          >
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts?.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

const CategorySection = () => {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const categoryImages = {
    "electronics": "https://img.freepik.com/free-photo/workplace-business-modern-male-accessories-laptop-white-background_155003-3242.jpg",
    "jewelery": "https://img.freepik.com/free-photo/beautiful-luxury-necklace-jewelry-display-window_23-2149553478.jpg",
    "men's clothing": "https://img.freepik.com/free-photo/new-mens-clothing-collection-hangers-store_1268-21287.jpg",
    "women's clothing": "https://img.freepik.com/free-photo/beautiful-clothes-rack-store_23-2148929281.jpg"
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><span className="loading">Loading categories...</span></div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error loading categories. Please try again later.</div>;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Shop By Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories?.map(category => (
            <Link 
              key={category} 
              to={`/category/${category}`}
              className="group relative overflow-hidden rounded-lg shadow-md hover-scale"
            >
              <div className="aspect-w-16 aspect-h-9 h-64">
                <img 
                  src={categoryImages[category] || "https://via.placeholder.com/300"}
                  alt={category}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
                  <h3 className="text-white text-xl font-semibold text-center capitalize">
                    {category}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Verified Customer",
      image: "https://randomuser.me/api/portraits/women/12.jpg",
      content: "I've been shopping here for years. The quality of products and customer service is unmatched. My recent order arrived earlier than expected!"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Verified Customer",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      content: "The checkout process was seamless, and the products exceeded my expectations. Will definitely be a returning customer!"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Verified Customer",
      image: "https://randomuser.me/api/portraits/women/33.jpg",
      content: "I love the variety of products available here. Found exactly what I was looking for and at a competitive price. Highly recommend!"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <div 
              key={testimonial.id} 
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="h-12 w-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700">"{testimonial.content}"</p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    size={18}
                    className="fill-yellow-400 text-yellow-400" 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Simulate API call
      setTimeout(() => {
        setSubmitted(true);
        setEmail('');
      }, 800);
    }
  };

  return (
    <section className="py-16 hero-gradient text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Subscribe to get exclusive offers, special deals, and updates on new arrivals.
        </p>
        {submitted ? (
          <div className="max-w-md mx-auto bg-white bg-opacity-20 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
            <p>You've been successfully subscribed to our newsletter.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-l-md focus:outline-none text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-brand-orange hover:bg-orange-600 text-white px-6 py-3 rounded-r-md font-medium"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <FeaturedProducts />
      <CategorySection />
      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default HomePage;
