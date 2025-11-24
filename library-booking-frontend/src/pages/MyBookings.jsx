import React, { useState } from 'react';
import { useMyBookings, useCancelBooking } from '../hooks/useBooking';
import { Calendar, MapPin, Clock, CreditCard } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';
import { formatCurrency, formatDate, formatTime, getStatusColor } from '../utils/helpers';

const MyBookings = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading } = useMyBookings({ status: statusFilter });
  const cancelBooking = useCancelBooking();
  
  const [cancelModal, setCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;

    try {
      await cancelBooking.mutateAsync({
        id: selectedBooking._id,
        reason: cancelReason || 'User cancelled'
      });
      setCancelModal(false);
      setSelectedBooking(null);
      setCancelReason('');
    } catch (error) {
      console.error('Cancel error:', error);
    }
  };

  const canCancelBooking = (booking) => {
    if (booking.bookingStatus !== 'confirmed') return false;
    const bookingDate = new Date(booking.bookingDate);
    const now = new Date();
    const hoursUntil = (bookingDate - now) / (1000 * 60 * 60);
    return hoursUntil > 24;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="lg" text="Loading bookings..." />
      </div>
    );
  }

  const bookings = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {bookings.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No bookings found</p>
            <Button onClick={() => window.location.href = '/libraries'}>
              Browse Libraries
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking._id} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Library Image */}
                  <div className="md:w-48 h-48 flex-shrink-0">
                    <img
                      src={booking.library_id?.coverImage || booking.library_id?.images?.[0] || 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400'}
                      alt={booking.library_id?.libraryName}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
                          {booking.library_id?.libraryName}
                        </h3>
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {booking.library_id?.address?.area}, {booking.library_id?.address?.city}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.bookingStatus)}`}>
                          {booking.bookingStatus}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="flex items-center text-gray-600 text-sm mb-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          Date
                        </div>
                        <div className="font-medium">{formatDate(booking.bookingDate)}</div>
                      </div>
                      <div>
                        <div className="flex items-center text-gray-600 text-sm mb-1">
                          <Clock className="w-4 h-4 mr-1" />
                          Time Slot
                        </div>
                        <div className="font-medium">{booking.timeSlot_id?.slotName}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-sm mb-1">Seat</div>
                        <div className="font-medium">{booking.seatNumber}</div>
                      </div>
                      <div>
                        <div className="flex items-center text-gray-600 text-sm mb-1">
                          <CreditCard className="w-4 h-4 mr-1" />
                          Amount
                        </div>
                        <div className="font-bold text-primary">{formatCurrency(booking.totalAmount)}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        Booking ID: <span className="font-medium">{booking.bookingId}</span>
                      </div>
                      {canCancelBooking(booking) && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancelClick(booking)}
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModal}
        onClose={() => setCancelModal(false)}
        title="Cancel Booking"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for cancellation (optional)
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows="3"
              placeholder="Enter reason..."
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setCancelModal(false)}>
              Keep Booking
            </Button>
            <Button
              variant="danger"
              onClick={handleCancelConfirm}
              disabled={cancelBooking.isPending}
            >
              {cancelBooking.isPending ? 'Cancelling...' : 'Yes, Cancel'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyBookings;
