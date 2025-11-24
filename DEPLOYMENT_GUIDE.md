# Deployment Guide - Library Seat Booking Platform

## Prerequisites

- MongoDB Atlas account (connection string provided)
- Node.js v18+ installed
- npm package manager

## Local Development Setup

### 1. Backend Setup

```bash
cd library-booking-backend

# Install dependencies
npm install

# The .env file is already configured with MongoDB Atlas connection:
# MONGODB_URI=mongodb+srv://nirbhayhiwse37:yw0ExVnvRl1MS4oM@cluster0.fe4cauu.mongodb.net/library-booking?retryWrites=true&w=majority&appName=Cluster0

# Seed the database (run once)
npm run seed

# Start the backend server
npm start
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd library-booking-frontend

# Install dependencies
npm install

# The .env file is already configured:
# VITE_API_URL=http://localhost:5000/api

# Start the frontend development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## Testing the Application

### 1. Access the Application

Open your browser and navigate to: `http://localhost:5173`

### 2. Test Credentials

Use these accounts to test different roles:

**Admin Account:**
- Email: `admin@library.com`
- Password: `Admin@123`
- Access: Full platform management

**Librarian Account:**
- Email: `raj@library.com`
- Password: `password123`
- Access: Manage library, time slots, bookings

**User Account:**
- Email: `john@example.com`
- Password: `password123`
- Access: Browse, book, manage bookings

### 3. Testing Flow

**As a User:**
1. Visit homepage - see featured libraries
2. Click "Find Libraries" - browse all libraries
3. Use filters to search by location and price
4. Click on a library to see details
5. Click "Book Now" - select date, time slot, and seat
6. Complete booking (payment simulation)
7. View "My Bookings" to see all bookings
8. Cancel a booking if needed

**As a Librarian:**
1. Login with librarian credentials
2. Dashboard shows booking statistics
3. Add/edit library details with images
4. Create and manage time slots
5. View all bookings for the library

**As an Admin:**
1. Login with admin credentials
2. Dashboard shows platform statistics
3. Approve/reject pending libraries
4. Manage all users and libraries
5. View commission reports

## Available Pages

### Public Pages
- ✅ Home - Hero section with featured libraries
- ✅ Library List - Browse all libraries with filters
- ✅ Library Details - View library information and amenities
- ✅ Login/Signup - Authentication pages

### Protected Pages (User)
- ✅ Booking Page - Complete booking flow
- ✅ My Bookings - View and manage bookings
- ✅ Profile - Update profile and change password

### Admin/Librarian Pages
- ⏳ Coming soon (backend APIs ready)

## API Endpoints

All backend APIs are functional:

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

### Libraries
- GET `/api/libraries` - Get all libraries (with filters)
- GET `/api/libraries/featured` - Get featured libraries
- GET `/api/libraries/:id` - Get single library
- POST `/api/libraries` - Create library (Librarian)
- PUT `/api/libraries/:id` - Update library (Librarian)
- DELETE `/api/libraries/:id` - Delete library (Librarian)

### Bookings
- POST `/api/bookings` - Create booking
- GET `/api/bookings/my-bookings` - Get user bookings
- GET `/api/bookings/:id` - Get single booking
- PUT `/api/bookings/:id/cancel` - Cancel booking
- GET `/api/bookings/check-availability` - Check seat availability

### Time Slots
- GET `/api/time-slots/library/:libraryId` - Get library time slots
- POST `/api/time-slots` - Create time slot (Librarian)

### Admin
- GET `/api/admin/dashboard-stats` - Dashboard statistics
- GET `/api/admin/pending-libraries` - Pending approvals
- PUT `/api/admin/approve-library/:id` - Approve library
- And more...

## Features Implemented

### User Features ✅
- Browse libraries with search and filters
- View library details with gallery
- Complete booking flow with seat selection
- View and manage bookings
- Cancel bookings (24hr window)
- User profile management

### System Features ✅
- JWT authentication with role-based access
- Secure password hashing
- Payment integration (Razorpay ready)
- Image upload support (Cloudinary)
- Commission tracking (10% automatic)
- Seat availability checking
- Responsive design (mobile, tablet, desktop)

## Troubleshooting

### MongoDB Connection Issues

If you encounter connection issues:
1. Ensure your IP is whitelisted in MongoDB Atlas
2. Check the connection string is correct
3. Verify network connectivity

### Port Already in Use

If port 5000 or 5173 is in use:
- Backend: Change PORT in `.env`
- Frontend: Vite will auto-suggest another port

### Module Not Found

If you see module errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

### Backend (Render/Railway)
1. Connect GitHub repository
2. Set environment variables from `.env`
3. Deploy command: `npm start`

### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set VITE_API_URL to production backend URL

### Database
- MongoDB Atlas is already configured
- No additional setup needed
- Run seed script once in production

## Next Steps

1. Complete remaining admin/librarian dashboard pages
2. Integrate actual Razorpay payment flow
3. Add email notifications
4. Add reviews and ratings
5. Deploy to production

## Support

For issues or questions:
- Check the main README.md
- Review PROJECT_STATUS.md for current status
- See backend/README.md for API documentation

---

**Status**: System is functional and ready for testing!
**Last Updated**: November 24, 2025
