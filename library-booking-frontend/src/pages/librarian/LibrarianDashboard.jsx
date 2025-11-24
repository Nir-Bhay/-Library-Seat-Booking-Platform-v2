import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { librarianService } from '../../services/librarianService';
import { Building2, BookOpen, DollarSign, Plus, Clock } from 'lucide-react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const LibrarianDashboard = () => {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLibraries: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const librariesData = await librarianService.getMyLibraries();
      setLibraries(librariesData || []);
      
      // Calculate basic stats
      setStats({
        totalLibraries: librariesData?.length || 0,
        totalBookings: 0, // This would come from bookings API
        totalRevenue: 0,
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error('Error:', error);
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

  const statCards = [
    {
      title: 'My Libraries',
      value: stats.totalLibraries,
      icon: Building2,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: BookOpen,
      color: 'bg-green-500',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Librarian Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your libraries and bookings</p>
          </div>
          <Link to="/librarian/add-library">
            <button className="btn btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Library
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* My Libraries */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Libraries</h2>
          {libraries.length === 0 ? (
            <Card className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You haven't added any libraries yet</p>
              <Link to="/librarian/add-library">
                <button className="btn btn-primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Library
                </button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {libraries.map((library) => (
                <Card key={library._id} className="overflow-hidden">
                  {library.images && library.images.length > 0 && (
                    <img
                      src={library.images[0]}
                      alt={library.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {library.name}
                    </h3>
                    <div className="space-y-1 text-sm mb-4">
                      <p>
                        <strong>Status:</strong>{' '}
                        <span className={library.isApproved ? 'text-green-600' : 'text-yellow-600'}>
                          {library.isApproved ? 'Approved' : 'Pending Approval'}
                        </span>
                      </p>
                      <p>
                        <strong>Seats:</strong> {library.availableSeats}/{library.totalSeats}
                      </p>
                      <p>
                        <strong>Rating:</strong> {library.rating?.toFixed(1) || 'N/A'} ⭐
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/librarian/edit-library/${library._id}`} className="flex-1">
                        <button className="btn btn-outline btn-sm w-full">Edit</button>
                      </Link>
                      <Link to={`/librarian/time-slots/${library._id}`} className="flex-1">
                        <button className="btn btn-primary btn-sm w-full flex items-center justify-center gap-1">
                          <Clock className="w-4 h-4" />
                          Slots
                        </button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/librarian/add-library">
              <Card hover className="p-4 text-center">
                <Plus className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Add Library</h3>
                <p className="text-sm text-gray-600">Register a new library</p>
              </Card>
            </Link>
            <Link to="/librarian/bookings">
              <Card hover className="p-4 text-center">
                <BookOpen className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">View Bookings</h3>
                <p className="text-sm text-gray-600">Manage all bookings</p>
              </Card>
            </Link>
            <Link to="/profile">
              <Card hover className="p-4 text-center">
                <Building2 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">My Profile</h3>
                <p className="text-sm text-gray-600">Update your information</p>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarianDashboard;
