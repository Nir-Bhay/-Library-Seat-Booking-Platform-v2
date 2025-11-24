# Library Seat Booking Platform - Backend

A comprehensive backend API for the Library Seat Booking Platform built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (User, Librarian, Admin)
- **Library Management**: CRUD operations for libraries with image upload support
- **Booking System**: Complete booking flow with seat availability checking
- **Payment Integration**: Razorpay payment gateway integration
- **Time Slot Management**: Flexible time slot creation and management
- **Admin Panel**: Comprehensive admin features for managing users, libraries, and bookings
- **Transaction Tracking**: Automated commission calculation and settlement tracking

## Tech Stack

- Node.js v18+
- Express.js v4
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt.js for password hashing
- Multer + Cloudinary for image uploads
- Razorpay for payments
- express-validator for validation
- helmet, cors, express-rate-limit for security

## Project Structure

```
library-booking-backend/
├── config/          # Configuration files (DB, Cloudinary, Razorpay)
├── controllers/     # Route controllers
├── models/          # Mongoose models
├── routes/          # API routes
├── middleware/      # Custom middleware (auth, validation, error handling)
├── utils/           # Utility functions
├── scripts/         # Seed scripts
└── server.js        # Entry point
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory (see `.env.example`):

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library-booking
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

### 3. Setup Database

Make sure MongoDB is running on your system.

### 4. Seed Initial Data

Run the seed script to populate the database with initial data including admin user, amenities, and sample libraries:

```bash
npm run seed
```

### 5. Start Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## Test Credentials

After running the seed script, you can use these credentials:

### Admin
- Email: `admin@library.com`
- Password: `Admin@123`

### Librarian
- Email: `raj@library.com`
- Password: `password123`

### User
- Email: `john@example.com`
- Password: `password123`

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (Protected)

### User Routes (`/api/users`)
- `GET /profile` - Get user profile (Protected)
- `PUT /profile` - Update profile (Protected)
- `PUT /change-password` - Change password (Protected)

### Library Routes (`/api/libraries`)
- `GET /` - Get all approved libraries (with filters)
- `GET /featured` - Get featured libraries
- `GET /:id` - Get single library
- `POST /` - Create library (Protected, Librarian only)
- `PUT /:id` - Update library (Protected, Librarian only)
- `DELETE /:id` - Delete library (Protected, Librarian only)
- `GET /my-libraries` - Get librarian's libraries (Protected, Librarian only)

### Time Slot Routes (`/api/time-slots`)
- `GET /library/:libraryId` - Get all slots for a library
- `POST /` - Create time slot (Protected, Librarian only)
- `PUT /:id` - Update time slot (Protected, Librarian only)
- `DELETE /:id` - Delete time slot (Protected, Librarian only)

### Booking Routes (`/api/bookings`)
- `GET /check-availability` - Check seat availability
- `POST /` - Create booking (Protected)
- `GET /my-bookings` - Get user's bookings (Protected)
- `GET /librarian/bookings` - Get librarian's bookings (Protected, Librarian only)
- `GET /:id` - Get single booking (Protected)
- `PUT /:id/cancel` - Cancel booking (Protected)

### Payment Routes (`/api/payment`)
- `POST /create-order` - Create Razorpay order (Protected)
- `POST /verify` - Verify payment (Protected)

### Admin Routes (`/api/admin`)
- `GET /dashboard-stats` - Get dashboard statistics
- `GET /pending-libraries` - Get libraries pending approval
- `PUT /approve-library/:id` - Approve library
- `PUT /reject-library/:id` - Reject library
- `GET /all-users` - Get all users
- `PUT /user/:id/status` - Update user status
- `DELETE /user/:id` - Delete user
- `GET /all-libraries` - Get all libraries
- `GET /all-bookings` - Get all bookings
- `GET /commission-report` - Get commission report
- `GET /settings` - Get platform settings
- `PUT /settings` - Update platform settings

All admin routes require admin role authentication.

## Database Schema

### Collections
1. **users** - User accounts (students, librarians, admins)
2. **libraries** - Library information and details
3. **time_slots** - Time slots for each library
4. **bookings** - Booking records
5. **amenities** - Available amenities
6. **transactions** - Payment and commission transactions
7. **admin_settings** - Platform configuration settings

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Role-based authorization
- Rate limiting (100 requests per 15 minutes)
- Helmet for security headers
- CORS configuration
- Input validation and sanitization
- XSS protection

## Development

The backend follows RESTful API conventions and includes:
- Comprehensive error handling
- Input validation
- Clean code architecture
- Modular structure
- Detailed API responses

## License

ISC
