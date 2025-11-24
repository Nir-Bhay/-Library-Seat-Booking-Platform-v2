import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { Users, Building2, BookOpen, DollarSign, TrendingUp, Clock } from 'lucide-react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/helpers';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard stats');
      console.error('Error fetching dashboard stats:', err);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="btn btn-primary"
          >
            Retry
          </button>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      link: '/admin/users',
    },
    {
      title: 'Total Librarians',
      value: stats?.totalLibrarians || 0,
      icon: Users,
      color: 'bg-purple-500',
      link: '/admin/users',
    },
    {
      title: 'Total Libraries',
      value: stats?.totalLibraries || 0,
      icon: Building2,
      color: 'bg-green-500',
      link: '/admin/libraries',
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      icon: BookOpen,
      color: 'bg-orange-500',
      link: '/admin/bookings',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: 'bg-emerald-500',
      link: '/admin/commission-report',
    },
    {
      title: 'Commission Earned',
      value: formatCurrency(stats?.commissionEarned || 0),
      icon: TrendingUp,
      color: 'bg-indigo-500',
      link: '/admin/commission-report',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your platform.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link key={index} to={stat.link}>
                <Card hover className="p-6">
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
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/admin/pending-approvals">
              <Card hover className="p-4 text-center">
                <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Pending Approvals</h3>
                <p className="text-sm text-gray-600">Review library requests</p>
              </Card>
            </Link>
            <Link to="/admin/users">
              <Card hover className="p-4 text-center">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Manage Users</h3>
                <p className="text-sm text-gray-600">View and manage users</p>
              </Card>
            </Link>
            <Link to="/admin/libraries">
              <Card hover className="p-4 text-center">
                <Building2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Manage Libraries</h3>
                <p className="text-sm text-gray-600">View all libraries</p>
              </Card>
            </Link>
            <Link to="/admin/settings">
              <Card hover className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600">Platform configuration</p>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
