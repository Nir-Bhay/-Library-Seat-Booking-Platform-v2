import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { libraryService } from '../services/libraryService';
import toast from 'react-hot-toast';

export const useLibraries = (params) => {
  return useQuery({
    queryKey: ['libraries', params],
    queryFn: () => libraryService.getLibraries(params)
  });
};

export const useFeaturedLibraries = () => {
  return useQuery({
    queryKey: ['libraries', 'featured'],
    queryFn: () => libraryService.getFeaturedLibraries()
  });
};

export const useLibrary = (id) => {
  return useQuery({
    queryKey: ['library', id],
    queryFn: () => libraryService.getLibrary(id),
    enabled: !!id
  });
};

export const useMyLibraries = () => {
  return useQuery({
    queryKey: ['myLibraries'],
    queryFn: () => libraryService.getMyLibraries()
  });
};

export const useCreateLibrary = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => libraryService.createLibrary(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myLibraries'] });
      toast.success('Library submitted for approval');
    },
    onError: (error) => {
      toast.error(error.error || 'Failed to create library');
    }
  });
};

export const useUpdateLibrary = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => libraryService.updateLibrary(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myLibraries'] });
      toast.success('Library updated successfully');
    },
    onError: (error) => {
      toast.error(error.error || 'Failed to update library');
    }
  });
};

export const useDeleteLibrary = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => libraryService.deleteLibrary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myLibraries'] });
      toast.success('Library deleted successfully');
    },
    onError: (error) => {
      toast.error(error.error || 'Failed to delete library');
    }
  });
};
