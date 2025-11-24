# Setup Guide - Library Seat Booking Platform

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **MongoDB** ([Download](https://www.mongodb.com/try/download/community))
- **Git** ([Download](https://git-scm.com/downloads))

## Step-by-Step Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd -Library-Seat-Booking-Platform-v2
```

### 2. Backend Setup

#### 2.1 Navigate to Backend Directory

```bash
cd library-booking-backend
```

#### 2.2 Install Dependencies

```bash
npm install
```

#### 2.3 Configure Environment Variables

A `.env` file has been created for you with default values. Open it and update the following:

```bash
# Required: Update this with a strong secret key
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-change-this-in-production

# Required if MongoDB is not running locally
MONGODB_URI=mongodb://localhost:27017/library-booking

# Optional: Add Razorpay credentials for payment features
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Optional: Add Cloudinary credentials for image upload features
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Note:** 
- The app will run without Razorpay and Cloudinary credentials, but payment and image upload features will be disabled.
- Make sure MongoDB is running on your machine before starting the backend.

#### 2.4 Start MongoDB

If MongoDB is not already running, start it:

**On Windows:**
```bash
# Run as Administrator
net start MongoDB
```

**On macOS/Linux:**
```bash
sudo systemctl start mongod
# or
mongod
```

#### 2.5 Seed the Database (Optional but Recommended)

This will create sample data including admin, users, libraries, etc.:

```bash
npm run seed
```

#### 2.6 Start the Backend Server

```bash
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
✅ Razorpay configured successfully (if credentials provided)
✅ Cloudinary configured successfully (if credentials provided)
Server running on port 5000
```

The backend API is now running at `http://localhost:5000`

### 3. Frontend Setup

Open a **new terminal window/tab** and follow these steps:

#### 3.1 Navigate to Frontend Directory

```bash
cd library-booking-frontend
```

#### 3.2 Install Dependencies

```bash
npm install
```

#### 3.3 Configure Environment Variables

A `.env` file has been created for you. You can modify it if needed:

```bash
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

#### 3.4 Start the Frontend Development Server

```bash
npm run dev
```

You should see:
```
  VITE v7.2.4  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

The frontend is now running at `http://localhost:5173`

### 4. Access the Application

Open your browser and go to: **http://localhost:5173**

## Test Accounts

After running the seed script, you can use these accounts:

### Admin Account
- **Email:** admin@library.com
- **Password:** Admin@123
- **Access:** Full platform management

### Librarian Account
- **Email:** raj@library.com
- **Password:** password123
- **Access:** Manage own library, time slots, bookings

### User Account
- **Email:** john@example.com
- **Password:** password123
- **Access:** Browse, book, manage bookings

## Common Issues and Solutions

### Frontend Issue: Tailwind CSS PostCSS Error

**Error Message:**
```
It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin
```

**Solution:** This has been fixed! The `postcss.config.js` now uses `@tailwindcss/postcss` plugin which is compatible with Tailwind CSS v4.

### Backend Issue: MongoDB Connection Error

**Error Message:**
```
Error: MONGODB_URI is not defined in environment variables
```

**Solution:**
1. Ensure the `.env` file exists in `library-booking-backend/` directory
2. Verify it contains `MONGODB_URI=mongodb://localhost:27017/library-booking`
3. Make sure MongoDB is running on your machine

### Backend Issue: Razorpay Error

**Error Message:**
```
Error: `key_id` or `oauthToken` is mandatory
```

**Solution:**
1. This warning is now handled gracefully. The app will work without Razorpay credentials.
2. To enable payment features, add your Razorpay credentials to the `.env` file:
   ```
   RAZORPAY_KEY_ID=your_actual_key_id
   RAZORPAY_KEY_SECRET=your_actual_secret
   ```
3. Get free test credentials from [Razorpay Dashboard](https://dashboard.razorpay.com/)

### Backend Warning: Duplicate Schema Index

**Warning Message:**
```
Warning: Duplicate schema index on {"email":1} found
```

**Solution:** This has been fixed! The duplicate index definitions have been removed from the User model.

### Port Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
1. Check if another process is using port 5000
2. Kill the process or change the port in backend `.env` file:
   ```
   PORT=5001
   ```

## Development Commands

### Backend

```bash
# Start server
npm start

# Start with auto-reload (if nodemon is installed)
npm run dev

# Seed database
npm run seed
```

### Frontend

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Next Steps

1. Explore the application at http://localhost:5173
2. Try logging in with the test accounts
3. Browse the API documentation in `library-booking-backend/README.md`
4. Check `PROJECT_STATUS.md` for development roadmap
5. Read the full specifications in the main `README.md`

## Getting Help

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running
4. Make sure all dependencies are installed
5. Check that both frontend and backend servers are running

## Security Notes

⚠️ **Important for Production:**
- Change the `JWT_SECRET` to a strong, random string
- Use production credentials for Razorpay and Cloudinary
- Update `FRONTEND_URL` to your production domain
- Never commit `.env` files to version control
- Enable HTTPS for production deployment

## Project Structure

```
.
├── library-booking-backend/     # Backend API
│   ├── config/                  # Configuration files
│   ├── controllers/             # Business logic
│   ├── models/                  # Database models
│   ├── routes/                  # API routes
│   ├── middleware/              # Auth, validation, etc.
│   ├── scripts/                 # Database seeding
│   └── .env                     # Environment variables
│
└── library-booking-frontend/    # Frontend React app
    ├── src/
    │   ├── components/          # Reusable components
    │   ├── pages/               # Route pages
    │   ├── services/            # API calls
    │   ├── hooks/               # Custom React hooks
    │   └── context/             # React context
    └── .env                     # Environment variables
```

Happy coding! 🚀
