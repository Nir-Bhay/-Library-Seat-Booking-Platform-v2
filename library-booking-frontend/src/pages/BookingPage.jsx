import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLibrary } from '../hooks/useLibrary';
import { useCreateBooking, useCheckAvailability } from '../hooks/useBooking';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { formatCurrency, formatDate, formatTime, generateSeatNumbers } from '../utils/helpers';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../utils/constants';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: libraryData, isLoading: libraryLoading } = useLibrary(id);
  const library = libraryData?.data;

  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState('');
  const [availableSeats, setAvailableSeats] = useState([]);

  const createBooking = useCreateBooking();

  // Fetch time slots when library loads
  useEffect(() => {
    if (library?._id) {
      fetchTimeSlots();
    }
  }, [library]);

  const fetchTimeSlots = async () => {
    setLoadingSlots(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/time-slots/library/${library._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTimeSlots(response.data.data || []);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast.error('Failed to load time slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  // Check availability when date and slot are selected
  useEffect(() => {
    if (selectedDate && selectedSlot) {
      checkAvailability();
    }
  }, [selectedDate, selectedSlot]);

  const checkAvailability = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/bookings/check-availability`, {
        params: {
          libraryId: library._id,
          date: selectedDate,
          timeSlotId: selectedSlot._id
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const bookedSeats = response.data.data.bookedSeats || [];
      const allSeats = generateSeatNumbers(library.totalSeats);
      const available = allSeats.filter(seat => !bookedSeats.includes(seat));
      setAvailableSeats(available);
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error('Failed to check seat availability');
    }
  };

  const calculatePrice = () => {
    if (!selectedSlot) return { basePrice: 0, taxAmount: 0, platformFee: 0, totalAmount: 0 };
    
    const basePrice = selectedSlot.price;
    const taxAmount = Math.round((basePrice * 18) / 100);
    const platformFee = 5;
    const totalAmount = basePrice + taxAmount + platformFee;
    
    return { basePrice, taxAmount, platformFee, totalAmount };
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot || !selectedSeat) {
      toast.error('Please select date, time slot, and seat');
      return;
    }

    try {
      const bookingData = {
        library_id: library._id,
        timeSlot_id: selectedSlot._id,
        bookingDate: selectedDate,
        seatNumber: selectedSeat
      };

      const response = await createBooking.mutateAsync(bookingData);
      
      if (response.success) {
        toast.success('Booking created! Redirecting to payment...');
        // In a real app, you would integrate Razorpay here
        setTimeout(() => {
          navigate('/my-bookings');
        }, 2000);
      }
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  if (libraryLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="lg" text="Loading..." />
      </div>
    );
  }

  if (!library) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-600 text-lg mb-4">Library not found</p>
        <Button onClick={() => navigate('/libraries')}>Back to Libraries</Button>
      </div>
    );
  }

  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const priceBreakdown = calculatePrice();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Book Your Seat</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Library Info */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">{library.libraryName}</h2>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                {library.address.area}, {library.address.city}
              </div>
            </Card>

            {/* Date Selection */}
            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Select Date
              </h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={minDate}
                max={maxDate}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </Card>

            {/* Time Slot Selection */}
            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Select Time Slot
              </h3>
              {loadingSlots ? (
                <Loader text="Loading time slots..." />
              ) : timeSlots.length === 0 ? (
                <p className="text-gray-600">No time slots available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot._id}
                      onClick={() => setSelectedSlot(slot)}
                      disabled={!selectedDate}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedSlot?._id === slot._id
                          ? 'border-primary bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!selectedDate ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="font-semibold">{slot.slotName}</div>
                      <div className="text-sm text-gray-600">
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </div>
                      <div className="text-primary font-bold mt-2">
                        {formatCurrency(slot.price)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Seat Selection */}
            {selectedSlot && (
              <Card>
                <h3 className="text-lg font-semibold mb-4">Select Seat</h3>
                {availableSeats.length === 0 ? (
                  <p className="text-gray-600">No seats available for this slot</p>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {availableSeats.map((seat) => (
                      <button
                        key={seat}
                        onClick={() => setSelectedSeat(seat)}
                        className={`p-3 rounded-lg border-2 font-medium transition-all ${
                          selectedSeat === seat
                            ? 'border-primary bg-blue-50 text-primary'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {seat}
                      </button>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Right Column - Booking Summary */}
          <div>
            <Card className="sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {selectedDate ? formatDate(selectedDate) : '-'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time Slot:</span>
                  <span className="font-medium">{selectedSlot?.slotName || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Seat:</span>
                  <span className="font-medium">{selectedSeat || '-'}</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Price:</span>
                  <span>{formatCurrency(priceBreakdown.basePrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (18%):</span>
                  <span>{formatCurrency(priceBreakdown.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Platform Fee:</span>
                  <span>{formatCurrency(priceBreakdown.platformFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-primary">{formatCurrency(priceBreakdown.totalAmount)}</span>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleBooking}
                disabled={!selectedDate || !selectedSlot || !selectedSeat || createBooking.isPending}
              >
                {createBooking.isPending ? 'Processing...' : 'Proceed to Payment'}
              </Button>

              <p className="text-xs text-center text-gray-500 mt-4">
                ✓ Free cancellation up to 24 hours before
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
