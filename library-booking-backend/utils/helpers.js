// Generate booking ID
const generateBookingId = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `BK-${dateStr}-${randomNum}`;
};

// Calculate price breakdown
const calculatePriceBreakdown = (basePrice) => {
  const taxPercentage = 18; // 18% GST
  const platformFee = 5; // Fixed ₹5
  
  const taxAmount = (basePrice * taxPercentage) / 100;
  const totalAmount = basePrice + taxAmount + platformFee;
  
  return {
    basePrice,
    taxAmount: Math.round(taxAmount * 100) / 100,
    platformFee,
    totalAmount: Math.round(totalAmount * 100) / 100
  };
};

// Calculate commission breakdown
const calculateCommission = (bookingAmount, commissionPercentage = 10) => {
  const platformCommission = (bookingAmount * commissionPercentage) / 100;
  const librarianPayout = bookingAmount - platformCommission;
  
  return {
    platformCommission: Math.round(platformCommission * 100) / 100,
    librarianPayout: Math.round(librarianPayout * 100) / 100
  };
};

// Check if date is valid for booking
const isValidBookingDate = (bookingDate, maxAdvanceDays = 30) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dateToBook = new Date(bookingDate);
  dateToBook.setHours(0, 0, 0, 0);
  
  // Check if date is in the past
  if (dateToBook < today) {
    return { valid: false, message: 'Cannot book for past dates' };
  }
  
  // Check if date is too far in the future
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + maxAdvanceDays);
  
  if (dateToBook > maxDate) {
    return { valid: false, message: `Cannot book more than ${maxAdvanceDays} days in advance` };
  }
  
  return { valid: true };
};

// Check if cancellation is allowed
const canCancelBooking = (bookingDate, cancellationHours = 24) => {
  const now = new Date();
  const bookingDateTime = new Date(bookingDate);
  const hoursUntilBooking = (bookingDateTime - now) / (1000 * 60 * 60);
  
  return hoursUntilBooking > cancellationHours;
};

module.exports = {
  generateBookingId,
  calculatePriceBreakdown,
  calculateCommission,
  isValidBookingDate,
  canCancelBooking
};
