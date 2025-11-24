import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLibrary } from '../hooks/useLibrary';
import { MapPin, Clock, Star, Wifi, Car, Coffee } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { formatCurrency, formatTime } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const LibraryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data, isLoading, error } = useLibrary(id);
  const library = data?.data;

  const [selectedImage, setSelectedImage] = useState(0);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/library/${id}` } });
      return;
    }
    navigate(`/booking/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="lg" text="Loading library details..." />
      </div>
    );
  }

  if (error || !library) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-600 text-lg mb-4">Library not found or error loading details.</p>
        <Button onClick={() => navigate('/libraries')}>Back to Libraries</Button>
      </div>
    );
  }

  const images = library.images?.length > 0 ? library.images : ['https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800'];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative h-96 rounded-lg overflow-hidden mb-4">
            <img
              src={images[selectedImage]}
              alt={library.libraryName}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-24 rounded-lg overflow-hidden cursor-pointer ${
                    selectedImage === index ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${library.libraryName} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{library.libraryName}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-1" />
                <span>
                  {library.address.area}, {library.address.city}, {library.address.pincode}
                </span>
              </div>
              {library.averageRating > 0 && (
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 fill-current mr-1" />
                  <span className="font-medium">{library.averageRating.toFixed(1)}</span>
                  <span className="text-gray-500 ml-1">({library.totalReviews} reviews)</span>
                </div>
              )}
            </div>

            {/* About */}
            <Card className="mb-6">
              <h2 className="text-xl font-semibold mb-3">About</h2>
              <p className="text-gray-700 leading-relaxed">
                {library.description || 'A well-equipped library with modern facilities.'}
              </p>
            </Card>

            {/* Amenities */}
            {library.amenities && library.amenities.length > 0 && (
              <Card className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {library.amenities.map((amenity) => (
                    <div key={amenity._id} className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {amenity.name === 'WiFi' && <Wifi className="w-4 h-4 text-primary" />}
                        {amenity.name === 'Parking' && <Car className="w-4 h-4 text-primary" />}
                        {amenity.name === 'Cafeteria' && <Coffee className="w-4 h-4 text-primary" />}
                        {!['WiFi', 'Parking', 'Cafeteria'].includes(amenity.name) && (
                          <span className="text-primary text-xs">✓</span>
                        )}
                      </div>
                      <span className="text-gray-700">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Timing */}
            <Card className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Timing</h2>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-5 h-5" />
                <span>
                  {formatTime(library.openTime)} - {formatTime(library.closeTime)}
                </span>
              </div>
              {library.daysOpen && library.daysOpen.length > 0 && (
                <p className="text-gray-600 mt-2">
                  Open: {library.daysOpen.join(', ')}
                </p>
              )}
            </Card>

            {/* Contact */}
            <Card>
              <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-medium">Phone:</span> {library.contactNumber}
                </p>
                {library.email && (
                  <p>
                    <span className="font-medium">Email:</span> {library.email}
                  </p>
                )}
                <p>
                  <span className="font-medium">Address:</span> {library.address.street},{' '}
                  {library.address.area}, {library.address.city}, {library.address.state} -{' '}
                  {library.address.pincode}
                </p>
                {library.address.landmark && (
                  <p>
                    <span className="font-medium">Landmark:</span> {library.address.landmark}
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div>
            <Card className="sticky top-4">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-primary mb-1">
                  {formatCurrency(library.pricePerHour)}
                </div>
                <p className="text-gray-600">per hour</p>
                {library.pricePerDay && (
                  <p className="text-sm text-gray-500 mt-1">
                    or {formatCurrency(library.pricePerDay)} per day
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Seats:</span>
                  <span className="font-medium">{library.totalSeats}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-medium text-green-600">{library.availableSeats}</span>
                </div>
              </div>

              <Button className="w-full mb-3" size="lg" onClick={handleBookNow}>
                Book Now
              </Button>

              <p className="text-xs text-center text-gray-500">
                ✓ Free cancellation up to 24 hours before
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryDetails;
