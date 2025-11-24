import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { librarianService } from '../../services/librarianService';
import { Clock, Plus, Trash2, Edit } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/helpers';

const TimeSlots = () => {
  const { libraryId } = useParams();
  const navigate = useNavigate();
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    pricePerHour: '',
  });

  useEffect(() => {
    fetchTimeSlots();
  }, [libraryId]);

  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      const slots = await librarianService.getTimeSlots(libraryId);
      setTimeSlots(slots || []);
    } catch (error) {
      toast.error('Failed to fetch time slots');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (slot = null) => {
    if (slot) {
      setEditingSlot(slot);
      setFormData({
        startTime: slot.startTime || '',
        endTime: slot.endTime || '',
        pricePerHour: slot.pricePerHour || '',
      });
    } else {
      setEditingSlot(null);
      setFormData({
        startTime: '',
        endTime: '',
        pricePerHour: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSlot(null);
    setFormData({
      startTime: '',
      endTime: '',
      pricePerHour: '',
    });
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
      if (editingSlot) {
        await librarianService.updateTimeSlot(editingSlot._id, formData);
        toast.success('Time slot updated successfully');
      } else {
        await librarianService.createTimeSlot(libraryId, formData);
        toast.success('Time slot created successfully');
      }
      
      handleCloseModal();
      fetchTimeSlots();
    } catch (error) {
      toast.error(error.error || 'Failed to save time slot');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this time slot?')) return;

    try {
      await librarianService.deleteTimeSlot(slotId);
      toast.success('Time slot deleted successfully');
      fetchTimeSlots();
    } catch (error) {
      toast.error(error.error || 'Failed to delete time slot');
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Time Slots</h1>
            <p className="text-gray-600 mt-2">Create and manage time slots for your library</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/librarian/dashboard')}>
              Back
            </Button>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="w-5 h-5 mr-2" />
              Add Time Slot
            </Button>
          </div>
        </div>

        {timeSlots.length === 0 ? (
          <Card className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No time slots created yet</p>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Time Slot
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timeSlots.map((slot) => (
              <Card key={slot._id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-gray-900">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                </div>
                <div className="space-y-1 text-sm mb-3">
                  <p className="text-gray-600">
                    <strong>Price:</strong> {formatCurrency(slot.pricePerHour)}/hour
                  </p>
                  <p className="text-gray-600">
                    <strong>Duration:</strong> {slot.duration} hours
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(slot)}
                    className="flex-1 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(slot._id)}
                    className="flex-1 text-red-600 hover:text-red-800 text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingSlot ? 'Edit Time Slot' : 'Add Time Slot'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Start Time"
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />

            <Input
              label="End Time"
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
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

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {editingSlot ? 'Update' : 'Create'} Time Slot
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default TimeSlots;
