
import React, { useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AuthPage= () => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register: registerUser, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to '/'
  const from = location.state?.from?.pathname || '/';
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  // If user is already authenticated, redirect to home page
  if (isAuthenticated) {
    return <Navigate to={from} />;
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (authMode === 'login') {
        await login(data.email, data.password);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      } else {
        await registerUser(data.name, data.email, data.password);
        toast({
          title: "Registration successful",
          description: "Your account has been created.",
        });
      }
      
      // Redirect to the page they tried to visit or home
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: authMode === 'login' ? "Login failed" : "Registration failed",
        description: (error).message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {authMode === 'login' ? 'Login to Your Account' : 'Create an Account'}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {authMode === 'register' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="name"
                    type="text"
                    className={`pl-10 w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="John Doe"
                    {...register('name', {
                      required: authMode === 'register' ? 'Name is required' : false
                    })}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="email"
                  type="email"
                  className={`pl-10 w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="your@email.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`pl-10 w-full p-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="******"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: authMode === 'register' ? {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    } : undefined
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-purple hover:bg-brand-dark-purple"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Register'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-brand-purple hover:underline font-medium"
              >
                {authMode === 'login' ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
