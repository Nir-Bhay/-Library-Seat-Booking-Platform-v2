import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { DollarSign, TrendingUp } from 'lucide-react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const CommissionReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCommissionReport();
      setReport(data);
    } catch (error) {
      toast.error('Failed to fetch commission report');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Commission Report</h1>
          <p className="text-gray-600 mt-2">Platform revenue and commission analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(report?.totalRevenue || 0)}
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Commission
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(report?.totalCommission || 0)}
                </p>
              </div>
              <div className="bg-indigo-500 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Commission Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {report?.commissionRate || 10}%
                </p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Library-wise Commission</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Library
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Bookings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Commission
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {report?.libraryCommissions?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.libraryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.totalBookings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(item.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(item.commission)}
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No commission data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CommissionReport;
