import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { CheckCircle, XCircle, MapPin, User, Phone, Mail } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const PendingApprovals = () => {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    fetchPendingLibraries();
  }, [pagination.page]);

  const fetchPendingLibraries = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPendingLibraries(pagination.page, 10);
      setLibraries(response.data || []);
      setPagination({
        page: response.pagination?.page || 1,
        totalPages: response.pagination?.pages || 1,
      });
    } catch (error) {
      const errorMessage = error?.error || error?.message || 'Failed to fetch pending libraries';
      toast.error(errorMessage);
      console.error('Error:', error);
      setLibraries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await adminService.approveLibrary(id);
      toast.success('Library approved successfully');
      fetchPendingLibraries();
    } catch (error) {
      const errorMessage = error?.error || error?.message || 'Failed to approve library';
      toast.error(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      setActionLoading(id);
      await adminService.rejectLibrary(id, reason);
      toast.success('Library rejected');
      fetchPendingLibraries();
    } catch (error) {
      const errorMessage = error?.error || error?.message || 'Failed to reject library';
      toast.error(errorMessage);
    } finally {
      setActionLoading(null);
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
          <h1 className="text-3xl font-bold text-gray-900">Pending Library Approvals</h1>
          <p className="text-gray-600 mt-2">Review and approve library registration requests</p>
        </div>

        {libraries.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600">No pending approvals at the moment</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {libraries.map((library) => (
              <Card key={library._id} className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Library Info */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {library.libraryName}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                        <span>
                          {library.address?.street}, {library.address?.area},{' '}
                          {library.address?.city}, {library.address?.state} -{' '}
                          {library.address?.pincode}
                        </span>
                      </div>
                      {library.description && (
                        <p className="text-gray-700 mt-2">{library.description}</p>
                      )}
                    </div>

                    {/* Librarian Details */}
                    {library.librarian_id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Librarian Details</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{library.librarian_id.fullName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{library.librarian_id.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{library.librarian_id.phone}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Images and Actions */}
                  <div>
                    {library.images && library.images.length > 0 && (
                      <div className="mb-4">
                        <img
                          src={library.images[0]}
                          alt={library.libraryName}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <strong>Total Seats:</strong> {library.totalSeats}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Available Seats:</strong> {library.availableSeats}
                      </p>
                      {library.amenities && library.amenities.length > 0 && (
                        <div className="text-sm text-gray-600">
                          <strong>Amenities:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {library.amenities.map((amenity, idx) => (
                              <span
                                key={idx}
                                className="bg-gray-100 px-2 py-1 rounded text-xs"
                              >
                                {amenity.name || amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Button
                        variant="primary"
                        onClick={() => handleApprove(library._id)}
                        disabled={actionLoading === library._id}
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {actionLoading === library._id ? 'Approving...' : 'Approve'}
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleReject(library._id)}
                        disabled={actionLoading === library._id}
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

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
        )}
      </div>
    </div>
  );
};

export default PendingApprovals;
