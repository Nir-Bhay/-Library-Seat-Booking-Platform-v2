import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';
import toast from 'react-hot-toast';

export const useMyBookings = (params) => {
  return useQuery({
    queryKey: ['myBookings', params],
    queryFn: () => bookingService.getMyBookings(params)
  });
};

export const useBooking = (id) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getBooking(id),
    enabled: !!id
  });
};

export const useLibrarianBookings = (params) => {
  return useQuery({
    queryKey: ['librarianBookings', params],
    queryFn: () => bookingService.getLibrarianBookings(params)
  });
};

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: (data) => bookingService.createBooking(data),
    onError: (error) => {
      toast.error(error.error || 'Failed to create booking');
    }
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }) => bookingService.cancelBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      queryClient.invalidateQueries({ queryKey: ['librarianBookings'] });
      toast.success('Booking cancelled successfully');
    },
    onError: (error) => {
      toast.error(error.error || 'Failed to cancel booking');
    }
  });
};

export const useCheckAvailability = (libraryId, date, timeSlotId) => {
  return useQuery({
    queryKey: ['availability', libraryId, date, timeSlotId],
    queryFn: () => bookingService.checkAvailability(libraryId, date, timeSlotId),
    enabled: !!(libraryId && date && timeSlotId)
  });
};
