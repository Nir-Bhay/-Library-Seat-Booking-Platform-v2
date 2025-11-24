import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { MapPin, Eye } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const LibraryManagement = () => {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    fetchLibraries();
  }, [pagination.page]);

  const fetchLibraries = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllLibraries(pagination.page, 10);
      setLibraries(response.data || []);
      setPagination({
        page: response.pagination?.page || 1,
        totalPages: response.pagination?.pages || 1,
      });
    } catch (error) {
      const errorMessage = error?.error || error?.message || 'Failed to fetch libraries';
      toast.error(errorMessage);
      console.error('Error:', error);
      setLibraries([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Library Management</h1>
          <p className="text-gray-600 mt-2">View and manage all libraries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {libraries.map((library) => (
            <Card key={library._id} className="overflow-hidden">
              {library.images && library.images.length > 0 && (
                <img
                  src={library.images[0]}
                  alt={library.libraryName}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {library.libraryName}
                </h3>
                <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>
                    {library.address?.city}, {library.address?.state}
                  </span>
                </div>
                <div className="space-y-1 text-sm mb-4">
                  <p>
                    <strong>Status:</strong>{' '}
                    <span className={library.isApproved ? 'text-green-600' : 'text-yellow-600'}>
                      {library.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </p>
                  <p>
                    <strong>Seats:</strong> {library.availableSeats}/{library.totalSeats}
                  </p>
                  <p>
                    <strong>Rating:</strong> {library.rating?.toFixed(1) || 'N/A'} ⭐
                  </p>
                </div>
                <Link to={`/library/${library._id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryManagement;
