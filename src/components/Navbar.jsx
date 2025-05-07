
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

const Navbar = () => {
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-brand-purple">ShopEase</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-700 hover:text-brand-purple font-medium">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-brand-purple font-medium">
              Products
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-brand-purple font-medium">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-brand-purple font-medium">
              Contact
            </Link>
          </nav>

          {/* Desktop Search, Cart and Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-3 pr-10 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-purple focus:border-brand-purple"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-brand-purple"
              >
                <Search size={18} />
              </button>
            </form>

            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-brand-purple" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="relative group">
                <Link to="/profile">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-gray-700 hover:text-brand-purple" />
                  )}
                </Link>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link 
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-2">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-3 pr-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-purple focus:border-brand-purple"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-brand-purple"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>
            
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/"
                className="text-gray-700 hover:text-brand-purple font-medium py-2"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link 
                to="/products"
                className="text-gray-700 hover:text-brand-purple font-medium py-2"
                onClick={toggleMenu}
              >
                Products
              </Link>
              <Link 
                to="/about"
                className="text-gray-700 hover:text-brand-purple font-medium py-2"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link 
                to="/contact"
                className="text-gray-700 hover:text-brand-purple font-medium py-2"
                onClick={toggleMenu}
              >
                Contact
              </Link>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <Link 
                  to="/cart"
                  className="flex items-center text-gray-700 hover:text-brand-purple font-medium py-2"
                  onClick={toggleMenu}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart {itemCount > 0 && `(${itemCount})`}
                </Link>
                
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2">
                    <Link 
                      to="/profile"
                      className="flex items-center text-gray-700 hover:text-brand-purple font-medium py-2"
                      onClick={toggleMenu}
                    >
                      <User className="h-5 w-5 mr-2" />
                      Profile
                    </Link>
                    <Link 
                      to="/orders"
                      className="text-gray-700 hover:text-brand-purple font-medium py-2"
                      onClick={toggleMenu}
                    >
                      Orders
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        toggleMenu();
                      }}
                      className="text-left text-gray-700 hover:text-brand-purple font-medium py-2"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login"
                    className="text-brand-purple hover:text-brand-dark-purple font-medium py-2"
                    onClick={toggleMenu}
                  >
                    Login / Register
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
