import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { useFeaturedLibraries } from '../hooks/useLibrary';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import { formatCurrency } from '../utils/helpers';

const Home = () => {
  const { data: featuredData, isLoading } = useFeaturedLibraries();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find & Book Your Perfect Study Space
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Browse libraries, check availability, and book seats instantly
            </p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-2">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1">
                  <div className="flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200">
                    <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Enter city or area"
                      className="w-full outline-none text-gray-700"
                    />
                  </div>
                </div>
                <Link to="/libraries" className="md:w-auto">
                  <Button className="w-full md:w-auto">
                    <Search className="w-5 h-5 mr-2 inline" />
                    Search Libraries
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Search Libraries</h3>
              <p className="text-gray-600">
                Browse and filter libraries by location, price, and amenities
              </p>
            </Card>

            <Card className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Date & Seat</h3>
              <p className="text-gray-600">
                Select your preferred date, time slot, and seat number
              </p>
            </Card>

            <Card className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Book & Pay</h3>
              <p className="text-gray-600">
                Complete payment securely and get instant confirmation
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Featured Libraries */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Libraries</h2>
            <Link to="/libraries">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader size="lg" text="Loading libraries..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredData?.data?.map((library) => (
                <Card key={library._id} hover className="overflow-hidden p-0">
                  <img
                    src={library.coverImage || library.images?.[0] || 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400'}
                    alt={library.libraryName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{library.libraryName}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {library.address.area}, {library.address.city}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(library.pricePerHour)}/hr
                      </span>
                      <Link to={`/library/${library._id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
