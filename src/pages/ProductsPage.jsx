
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ShoppingCart, Filter, ChevronDown, X, Star } from 'lucide-react';
import { getProducts, getCategories } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';


const ProductsPage = () => {
  const { data: products, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const [filters, setFilters] = useState<FilterOptions>({
    category: null,
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'default',
  });

  const [showFilters, setShowFilters] = useState(false);
  const { addItem } = useCart();

  // Find the max price in products for the range filter
  useEffect(() => {
    if (products) {
      const maxProductPrice = Math.ceil(Math.max(...products.map(p => p.price)));
      setFilters(prev => ({
        ...prev,
        maxPrice: maxProductPrice
      }));
    }
  }, [products]);

  const filteredProducts = products?.filter(product => {
    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    // Price range filter
    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false;
    }
    return true;
  }) || [];

  // Sort the filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low-high':
        return a.price - b.price;
      case 'price-high-low':
        return b.price - a.price;
      case 'rating':
        return b.rating.rate - a.rating.rate;
      default:
        return 0; // Keep original order
    }
  });

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: null,
      minPrice: 0,
      maxPrice: 1000,
      sortBy: 'default',
    });
  };

  if (productsLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center">
          <span className="loading">Loading products...</span>
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-red-500">
          Error loading products. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="w-full flex items-center justify-center"
        >
          <Filter size={16} className="mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar - Desktop always visible, mobile toggle */}
        <div className={`w-full lg:w-1/4 xl:w-1/5 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white p-4 rounded-lg border border-gray-200 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Filters</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="text-sm text-gray-500 hover:text-brand-purple"
              >
                Reset
              </Button>
            </div>

            <Accordion type="single" collapsible defaultValue="category">
              {/* Categories Filter */}
              <AccordionItem value="category">
                <AccordionTrigger>Categories</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="category-all"
                        name="category"
                        checked={filters.category === null}
                        onChange={() => handleFilterChange('category', null)}
                        className="mr-2"
                      />
                      <label htmlFor="category-all" className="text-gray-700">All Categories</label>
                    </div>
                    {categoriesLoading ? (
                      <div>Loading categories...</div>
                    ) : (
                      categories?.map(category => (
                        <div key={category} className="flex items-center">
                          <input
                            type="radio"
                            id={`category-${category}`}
                            name="category"
                            checked={filters.category === category}
                            onChange={() => handleFilterChange('category', category)}
                            className="mr-2"
                          />
                          <label htmlFor={`category-${category}`} className="text-gray-700 capitalize">{category}</label>
                        </div>
                      ))
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Price Range Filter */}
              <AccordionItem value="price">
                <AccordionTrigger>Price Range</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>${filters.minPrice}</span>
                      <span>to</span>
                      <span>${filters.maxPrice}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Sort By Filter */}
              <AccordionItem value="sort">
                <AccordionTrigger>Sort By</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="sort-default"
                        name="sortBy"
                        checked={filters.sortBy === 'default'}
                        onChange={() => handleFilterChange('sortBy', 'default')}
                        className="mr-2"
                      />
                      <label htmlFor="sort-default" className="text-gray-700">Default</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="sort-price-low"
                        name="sortBy"
                        checked={filters.sortBy === 'price-low-high'}
                        onChange={() => handleFilterChange('sortBy', 'price-low-high')}
                        className="mr-2"
                      />
                      <label htmlFor="sort-price-low" className="text-gray-700">Price: Low to High</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="sort-price-high"
                        name="sortBy"
                        checked={filters.sortBy === 'price-high-low'}
                        onChange={() => handleFilterChange('sortBy', 'price-high-low')}
                        className="mr-2"
                      />
                      <label htmlFor="sort-price-high" className="text-gray-700">Price: High to Low</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="sort-rating"
                        name="sortBy"
                        checked={filters.sortBy === 'rating'}
                        onChange={() => handleFilterChange('sortBy', 'rating')}
                        className="mr-2"
                      />
                      <label htmlFor="sort-rating" className="text-gray-700">Highest Rated</label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Products Grid */}
        <div className="w-full lg:w-3/4 xl:w-4/5">
          {/* Applied filters */}
          {(filters.category || filters.minPrice > 0 || filters.maxPrice < 1000 || filters.sortBy !== 'default') && (
            <div className="mb-4 flex flex-wrap gap-2">
              {filters.category && (
                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                  Category: {filters.category}
                  <button 
                    onClick={() => handleFilterChange('category', null)} 
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                  Price: ${filters.minPrice} - ${filters.maxPrice}
                  <button 
                    onClick={() => {
                      handleFilterChange('minPrice', 0);
                      handleFilterChange('maxPrice', 1000);
                    }} 
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {filters.sortBy !== 'default' && (
                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                  Sort: {filters.sortBy.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  <button 
                    onClick={() => handleFilterChange('sortBy', 'default')} 
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <button 
                onClick={resetFilters}
                className="text-brand-purple text-sm hover:underline"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Results count and sort dropdown (mobile) */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">{sortedProducts.length} products</p>
            <div className="lg:hidden relative">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="border border-gray-300 rounded-md p-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-brand-purple"
              >
                <option value="default">Sort: Default</option>
                <option value="price-low-high">Sort: Price Low-High</option>
                <option value="price-high-low">Sort: Price High-Low</option>
                <option value="rating">Sort: Highest Rated</option>
              </select>
              <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>
          </div>

          {/* Product Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map(product => (
                <div key={product.id} className="product-card group">
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
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-700">No products found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your filters</p>
              <button 
                onClick={resetFilters} 
                className="mt-4 px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-dark-purple"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
