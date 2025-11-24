import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLibraries } from '../hooks/useLibrary';
import { MapPin, Star, Search, Filter } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { formatCurrency } from '../utils/helpers';

const LibraryList = () => {
  const [filters, setFilters] = useState({
    city: '',
    area: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error } = useLibraries(filters);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      area: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Libraries</h1>
          
          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by library name, city, or area..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </Button>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <Card className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    placeholder="Enter city"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={filters.area}
                    onChange={handleFilterChange}
                    placeholder="Enter area"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="₹0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="₹1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" text="Loading libraries..." />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Error loading libraries. Please try again.</p>
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No libraries found matching your criteria.</p>
            <Button onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-gray-600">
                Showing {data?.data?.length || 0} of {data?.pagination?.total || 0} libraries
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.data?.map((library) => (
                <Card key={library._id} hover className="overflow-hidden p-0">
                  <img
                    src={library.coverImage || library.images?.[0] || 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400'}
                    alt={library.libraryName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                      {library.libraryName}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {library.address.area}, {library.address.city}
                    </div>
                    {library.averageRating > 0 && (
                      <div className="flex items-center text-sm mb-3">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        <span className="font-medium">{library.averageRating.toFixed(1)}</span>
                        <span className="text-gray-500 ml-1">({library.totalReviews} reviews)</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(library.pricePerHour)}
                        </span>
                        <span className="text-gray-500 text-sm">/hr</span>
                      </div>
                      <Link to={`/library/${library._id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LibraryList;
