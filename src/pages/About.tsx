import React from 'react';
import { Users, Award, Leaf, Heart } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Orchid Haven</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate about orchids, dedicated to bringing the world's most beautiful 
              flowers to your home with expert care and unmatched quality.
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2018 by orchid enthusiast Maria Chen, Orchid Haven began as a 
                  small greenhouse operation in Northern California. What started as a personal 
                  passion for these extraordinary flowers has grown into a trusted source for 
                  orchid lovers worldwide.
                </p>
                <p>
                  We believe that everyone deserves to experience the beauty and tranquility 
                  that orchids bring to a space. That's why we've dedicated ourselves to 
                  sourcing the finest specimens and providing the knowledge and support needed 
                  to help them thrive in your home.
                </p>
                <p>
                  Today, we work with certified growers across the globe to bring you healthy, 
                  vibrant orchids that are carefully selected for their beauty, hardiness, 
                  and unique characteristics.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1379927/pexels-photo-1379927.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Orchid greenhouse"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything we do is guided by our commitment to quality, sustainability, 
              and exceptional customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sustainability</h3>
              <p className="text-gray-600">
                We partner with eco-conscious growers and use sustainable packaging 
                to minimize our environmental impact.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality</h3>
              <p className="text-gray-600">
                Every orchid is carefully inspected and selected for its health, 
                beauty, and potential to thrive in your care.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                We believe in building a community of orchid enthusiasts who 
                support and learn from each other.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Passion</h3>
              <p className="text-gray-600">
                Our love for orchids drives everything we do, from selection 
                to customer service and beyond.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our passionate team of orchid experts is here to help you find the 
              perfect orchid and provide ongoing support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">MC</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Maria Chen</h3>
              <p className="text-emerald-600 font-medium mb-2">Founder & CEO</p>
              <p className="text-gray-600 text-sm">
                25+ years of orchid expertise, certified master grower, 
                and passionate advocate for sustainable horticulture.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">DK</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Dr. Sarah Kim</h3>
              <p className="text-emerald-600 font-medium mb-2">Head of Plant Sciences</p>
              <p className="text-gray-600 text-sm">
                PhD in Botany with specialization in orchid genetics and 
                conservation. Ensures the health of every plant we ship.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">JR</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">James Rodriguez</h3>
              <p className="text-emerald-600 font-medium mb-2">Customer Success Manager</p>
              <p className="text-gray-600 text-sm">
                Expert in orchid care with 15+ years of experience. 
                Provides personalized guidance to help your orchids thrive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Commitment to You</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We stand behind every orchid we sell with our 30-day healthy arrival guarantee 
            and lifetime customer support. Your success is our success.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">30-Day Guarantee</h3>
              <p className="text-gray-600">
                If your orchid doesn't arrive healthy and thriving, we'll replace it 
                or provide a full refund.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-gray-600">
                Our team of orchid specialists is available to help with care questions, 
                troubleshooting, and advice.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lifetime Learning</h3>
              <p className="text-gray-600">
                Access to our comprehensive care guides, video tutorials, and 
                community of fellow orchid enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};