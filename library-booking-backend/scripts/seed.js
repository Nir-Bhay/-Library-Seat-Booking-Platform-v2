const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Amenity = require('../models/Amenity');
const Library = require('../models/Library');
const TimeSlot = require('../models/TimeSlot');
const AdminSetting = require('../models/AdminSetting');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Amenity.deleteMany({});
    await Library.deleteMany({});
    await TimeSlot.deleteMany({});
    await AdminSetting.deleteMany({});

    // Create admin user
    console.log('Creating admin user...');
    const admin = await User.create({
      fullName: 'Admin User',
      email: 'admin@library.com',
      phone: '9999999999',
      password: 'Admin@123',
      role: 'admin',
      isVerified: true
    });

    // Create sample users
    console.log('Creating sample users...');
    const user1 = await User.create({
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      password: 'password123',
      role: 'user',
      isVerified: true
    });

    const user2 = await User.create({
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '9876543211',
      password: 'password123',
      role: 'user',
      isVerified: true
    });

    // Create librarians
    console.log('Creating librarian users...');
    const librarian1 = await User.create({
      fullName: 'Raj Kumar',
      email: 'raj@library.com',
      phone: '9876543212',
      password: 'password123',
      role: 'librarian',
      isVerified: true
    });

    const librarian2 = await User.create({
      fullName: 'Priya Sharma',
      email: 'priya@library.com',
      phone: '9876543213',
      password: 'password123',
      role: 'librarian',
      isVerified: true
    });

    // Create amenities
    console.log('Creating amenities...');
    const amenities = await Amenity.insertMany([
      { name: 'WiFi', icon: 'Wifi', category: 'basic', isActive: true },
      { name: 'AC', icon: 'Wind', category: 'comfort', isActive: true },
      { name: 'Parking', icon: 'Car', category: 'basic', isActive: true },
      { name: 'Water Dispenser', icon: 'Droplet', category: 'basic', isActive: true },
      { name: 'Cafeteria', icon: 'Coffee', category: 'food', isActive: true },
      { name: 'Locker', icon: 'Lock', category: 'safety', isActive: true },
      { name: 'CCTV', icon: 'Camera', category: 'safety', isActive: true },
      { name: 'Power Backup', icon: 'Zap', category: 'basic', isActive: true },
      { name: 'Washroom', icon: 'Home', category: 'basic', isActive: true },
      { name: 'Printing Service', icon: 'Printer', category: 'other', isActive: true }
    ]);

    // Create sample libraries
    console.log('Creating sample libraries...');
    const library1 = await Library.create({
      librarian_id: librarian1._id,
      libraryName: 'Central Library Delhi',
      description: 'A peaceful and well-equipped library in the heart of Delhi with modern facilities and comfortable seating.',
      address: {
        street: '123 Main Street',
        area: 'Connaught Place',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        landmark: 'Near Metro Station'
      },
      contactNumber: '9876543212',
      email: 'central@library.com',
      images: [
        'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800',
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800'
      ],
      coverImage: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800',
      totalSeats: 50,
      amenities: [amenities[0]._id, amenities[1]._id, amenities[2]._id, amenities[3]._id, amenities[6]._id, amenities[8]._id],
      pricePerHour: 50,
      pricePerDay: 400,
      openTime: '08:00',
      closeTime: '22:00',
      daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      isApproved: true,
      isActive: true,
      approvedBy: admin._id,
      approvedAt: new Date(),
      averageRating: 4.5,
      totalReviews: 120
    });

    const library2 = await Library.create({
      librarian_id: librarian2._id,
      libraryName: 'Knowledge Hub Mumbai',
      description: 'Premium library with air-conditioned spaces, high-speed WiFi, and dedicated study zones for focused learning.',
      address: {
        street: '456 College Road',
        area: 'Andheri West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400058',
        landmark: 'Opposite Mall'
      },
      contactNumber: '9876543213',
      email: 'knowledge@library.com',
      images: [
        'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800'
      ],
      coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800',
      totalSeats: 80,
      amenities: [amenities[0]._id, amenities[1]._id, amenities[2]._id, amenities[3]._id, amenities[4]._id, amenities[5]._id, amenities[6]._id, amenities[7]._id, amenities[8]._id],
      pricePerHour: 60,
      pricePerDay: 500,
      openTime: '07:00',
      closeTime: '23:00',
      daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      isApproved: true,
      isActive: true,
      approvedBy: admin._id,
      approvedAt: new Date(),
      averageRating: 4.8,
      totalReviews: 200
    });

    const library3 = await Library.create({
      librarian_id: librarian1._id,
      libraryName: 'Study Space Bangalore',
      description: 'Modern co-working style library with excellent infrastructure and a quiet environment for students and professionals.',
      address: {
        street: '789 Tech Park',
        area: 'Koramangala',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560034',
        landmark: 'Near Forum Mall'
      },
      contactNumber: '9876543214',
      email: 'study@library.com',
      images: [
        'https://images.unsplash.com/photo-1526243741027-444d633d7365?w=800'
      ],
      coverImage: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?w=800',
      totalSeats: 60,
      amenities: [amenities[0]._id, amenities[1]._id, amenities[2]._id, amenities[3]._id, amenities[6]._id, amenities[8]._id, amenities[9]._id],
      pricePerHour: 55,
      pricePerDay: 450,
      openTime: '08:00',
      closeTime: '22:00',
      daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      isApproved: true,
      isActive: true,
      approvedBy: admin._id,
      approvedAt: new Date(),
      averageRating: 4.6,
      totalReviews: 150
    });

    // Create time slots for each library
    console.log('Creating time slots...');
    const libraries = [library1, library2, library3];
    
    for (const library of libraries) {
      await TimeSlot.insertMany([
        {
          library_id: library._id,
          slotName: 'Morning Slot',
          startTime: '08:00',
          endTime: '12:00',
          price: library.pricePerHour * 4,
          maxCapacity: library.totalSeats,
          isActive: true
        },
        {
          library_id: library._id,
          slotName: 'Afternoon Slot',
          startTime: '12:00',
          endTime: '17:00',
          price: library.pricePerHour * 5,
          maxCapacity: library.totalSeats,
          isActive: true
        },
        {
          library_id: library._id,
          slotName: 'Evening Slot',
          startTime: '17:00',
          endTime: '22:00',
          price: library.pricePerHour * 5,
          maxCapacity: library.totalSeats,
          isActive: true
        }
      ]);
    }

    // Create admin settings
    console.log('Creating admin settings...');
    await AdminSetting.insertMany([
      {
        key: 'platform_commission',
        value: 10,
        dataType: 'number',
        description: 'Platform commission percentage',
        updatedBy: admin._id
      },
      {
        key: 'booking_cancellation_hours',
        value: 24,
        dataType: 'number',
        description: 'Minimum hours before booking to allow cancellation',
        updatedBy: admin._id
      },
      {
        key: 'max_advance_booking_days',
        value: 30,
        dataType: 'number',
        description: 'Maximum days in advance to allow booking',
        updatedBy: admin._id
      },
      {
        key: 'tax_percentage',
        value: 18,
        dataType: 'number',
        description: 'Tax percentage (GST)',
        updatedBy: admin._id
      },
      {
        key: 'platform_fee',
        value: 5,
        dataType: 'number',
        description: 'Fixed platform fee per booking',
        updatedBy: admin._id
      }
    ]);

    console.log('Seed data created successfully!');
    console.log('\n=== Test Credentials ===');
    console.log('Admin:');
    console.log('  Email: admin@library.com');
    console.log('  Password: Admin@123');
    console.log('\nLibrarian:');
    console.log('  Email: raj@library.com');
    console.log('  Password: password123');
    console.log('\nUser:');
    console.log('  Email: john@example.com');
    console.log('  Password: password123');
    console.log('========================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
