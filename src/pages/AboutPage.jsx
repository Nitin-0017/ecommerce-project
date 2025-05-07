
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About ShopEase</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your one-stop destination for quality products at affordable prices.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 2015, ShopEase began with a simple mission: to make online shopping 
                accessible, affordable, and enjoyable for everyone. What started as a small venture 
                has grown into a trusted online marketplace serving thousands of customers worldwide.
              </p>
              <p className="text-gray-700 mb-4">
                Our founder, Jane Smith, recognized the need for a user-friendly shopping platform that 
                offered quality products without the premium price tag. With a background in retail and 
                technology, Jane assembled a team of like-minded professionals who shared her vision.
              </p>
              <p className="text-gray-700">
                Today, ShopEase continues to expand its product range while maintaining its core values 
                of quality, affordability, and exceptional customer service.
              </p>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://img.freepik.com/free-photo/team-young-specialist-sitting-office-desk_146671-15767.jpg" 
                alt="Our team working" 
                className="rounded-lg shadow-lg w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Quality</h3>
              <p className="text-gray-700">
                We carefully select every product on our platform to ensure it meets 
                our high standards of quality and durability.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Affordability</h3>
              <p className="text-gray-700">
                We believe that everyone deserves access to good products at 
                reasonable prices, without compromising on quality.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Customer Service</h3>
              <p className="text-gray-700">
                Our dedicated support team is always ready to assist you with any 
                questions or concerns about your purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Jane Smith",
                role: "Founder & CEO",
                image: "https://randomuser.me/api/portraits/women/44.jpg",
              },
              {
                name: "Michael Johnson",
                role: "Chief Operations Officer",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
              },
              {
                name: "Sarah Williams",
                role: "Head of Product",
                image: "https://randomuser.me/api/portraits/women/68.jpg",
              },
              {
                name: "David Chen",
                role: "Customer Experience Manager",
                image: "https://randomuser.me/api/portraits/men/75.jpg",
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-40 h-40 rounded-full mx-auto object-cover mb-4"
                />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
