import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { librarianService } from '../../services/librarianService';
import { libraryService } from '../../services/libraryService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const AddEditLibrary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    libraryName: '',
    description: '',
    totalSeats: '',
    pricePerHour: '',
    contactNumber: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (id) {
      fetchLibrary();
    }
  }, [id]);

  const fetchLibrary = async () => {
    try {
      setLoading(true);
      const response = await libraryService.getLibrary(id);
      const library = response.data;
      setFormData({
        libraryName: library.libraryName || '',
        description: library.description || '',
        totalSeats: library.totalSeats || '',
        pricePerHour: library.pricePerHour || '',
        contactNumber: library.contactNumber || '',
        street: library.address?.street || '',
        area: library.address?.area || '',
        city: library.address?.city || '',
        state: library.address?.state || '',
        pincode: library.address?.pincode || '',
      });
    } catch (error) {
      const errorMessage = error?.error || error?.message || 'Failed to fetch library details';
      toast.error(errorMessage);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      const data = new FormData();
      
      data.append('libraryName', formData.libraryName);
      data.append('description', formData.description);
      data.append('totalSeats', formData.totalSeats);
      data.append('pricePerHour', formData.pricePerHour);
      data.append('contactNumber', formData.contactNumber);
      data.append('address[street]', formData.street);
      data.append('address[area]', formData.area);
      data.append('address[city]', formData.city);
      data.append('address[state]', formData.state);
      data.append('address[pincode]', formData.pincode);

      if (id) {
        await librarianService.updateLibrary(id, data);
        toast.success('Library updated successfully');
      } else {
        await librarianService.createLibrary(data);
        toast.success('Library created successfully. Awaiting admin approval.');
      }
      
      navigate('/librarian/dashboard');
    } catch (error) {
      const errorMessage = error?.error || error?.message || 'Failed to save library';
      toast.error(errorMessage);
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
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
          <h1 className="text-3xl font-bold text-gray-900">
            {id ? 'Edit Library' : 'Add New Library'}
          </h1>
          <p className="text-gray-600 mt-2">
            {id ? 'Update your library information' : 'Register a new library'}
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Library Name"
              type="text"
              name="libraryName"
              value={formData.libraryName}
              onChange={handleChange}
              required
              placeholder="Enter library name"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Describe your library..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Total Seats"
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g., 50"
              />

              <Input
                label="Price per Hour (₹)"
                type="number"
                name="pricePerHour"
                value={formData.pricePerHour}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="e.g., 50"
              />
            </div>

            <Input
              label="Contact Number"
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              placeholder="10-digit contact number"
              minLength="10"
              maxLength="10"
            />

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
              
              <Input
                label="Street"
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
                placeholder="Street address"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Area"
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  placeholder="Area/Locality"
                />

                <Input
                  label="City"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="City"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                  label="State"
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  placeholder="State"
                />

                <Input
                  label="Pincode"
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  placeholder="Pincode"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/librarian/dashboard')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : id ? 'Update Library' : 'Add Library'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddEditLibrary;
