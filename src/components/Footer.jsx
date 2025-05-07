
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-brand-purple mb-4">ShopEase</h3>
            <p className="text-gray-300 mb-4">
              Your one-stop destination for quality products at affordable prices. Shop with ease, shop with confidence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-brand-purple">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-brand-purple">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-brand-purple">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-brand-purple">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-brand-purple">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-brand-purple">Products</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-brand-purple">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-brand-purple">Contact</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-brand-purple">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-brand-purple">FAQ</Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-brand-purple">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-brand-purple">Returns & Refunds</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-brand-purple">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-brand-purple">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-brand-purple mr-2 flex-shrink-0" />
                <span className="text-gray-300">
                  123 Commerce Street, Shopping District, SH 10001
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-brand-purple mr-2 flex-shrink-0" />
                <span className="text-gray-300">(123) 456-7890</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-brand-purple mr-2 flex-shrink-0" />
                <span className="text-gray-300">support@shopease.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} ShopEase. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <img 
                src="https://www.paypalobjects.com/webstatic/mktg/logo/AM_mc_vs_dc_ae.jpg" 
                alt="Payment methods" 
                className="h-6" 
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
