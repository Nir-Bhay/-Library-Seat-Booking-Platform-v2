import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const PlatformSettings = () => {
  const [settings, setSettings] = useState({
    platformCommission: 10,
    cancellationCharges: 10,
    taxPercentage: 18,
    minBookingDuration: 1,
    maxBookingDuration: 30,
    cancellationWindow: 24,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: parseFloat(value) || 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await adminService.updateSettings(settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error(error.error || 'Failed to update settings');
    } finally {
      setSaving(false);
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600 mt-2">Configure platform-wide settings</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Platform Commission (%)"
              type="number"
              name="platformCommission"
              value={settings.platformCommission}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.1"
            />

            <Input
              label="Cancellation Charges (%)"
              type="number"
              name="cancellationCharges"
              value={settings.cancellationCharges}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.1"
            />

            <Input
              label="Tax Percentage (%)"
              type="number"
              name="taxPercentage"
              value={settings.taxPercentage}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.1"
            />

            <Input
              label="Minimum Booking Duration (hours)"
              type="number"
              name="minBookingDuration"
              value={settings.minBookingDuration}
              onChange={handleChange}
              min="1"
            />

            <Input
              label="Maximum Booking Duration (days)"
              type="number"
              name="maxBookingDuration"
              value={settings.maxBookingDuration}
              onChange={handleChange}
              min="1"
            />

            <Input
              label="Cancellation Window (hours)"
              type="number"
              name="cancellationWindow"
              value={settings.cancellationWindow}
              onChange={handleChange}
              min="0"
            />

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PlatformSettings;
