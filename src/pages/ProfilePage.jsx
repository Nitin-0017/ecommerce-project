
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { User, Mail, Package, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getUserOrders } = useOrders();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: { pathname: '/profile' } }} />;
  }
  
  const orders = user ? getUserOrders(user.id) : [];
  
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    // This would typically update the user profile in the backend
    // For now, we'll just show a success message
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    setIsEditing(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const processingOrders = orders.filter(order => order.status === 'processing').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Profile */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              {!isEditing && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>
            
            <div className="p-6">
              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      type="submit"
                      className="bg-brand-purple hover:bg-brand-dark-purple"
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setName(user?.name || '');
                        setEmail(user?.email || '');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="h-16 w-16 rounded-full mr-4"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        <User size={32} className="text-gray-500" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">{user?.name}</h3>
                      <p className="text-sm text-gray-500">Member since {new Date().getFullYear()}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-start mb-4">
                      <Mail className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email Address</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start mb-4">
                      <Package className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Orders</p>
                        <p className="text-sm text-gray-600">{orders.length} orders placed</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Account Security */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Account Security</h2>
            </div>
            
            <div className="p-6">
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <span className="block text-2xl font-bold text-brand-purple">{orders.length}</span>
                  <span className="text-sm text-gray-600">Total Orders</span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <span className="block text-2xl font-bold text-green-500">{completedOrders}</span>
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <span className="block text-2xl font-bold text-blue-500">{processingOrders}</span>
                  <span className="text-sm text-gray-600">Processing</span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <span className="block text-2xl font-bold text-yellow-500">
                    {orders.length - completedOrders - processingOrders}
                  </span>
                  <span className="text-sm text-gray-600">Other</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Button
                  className="w-full bg-brand-purple hover:bg-brand-dark-purple"
                  onClick={() => navigate('/orders')}
                >
                  View All Orders
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
