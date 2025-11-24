# Quick Start Guide - Library Seat Booking Platform

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js v18 or higher
- MongoDB installed and running
- Git

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd -Library-Seat-Booking-Platform-v2
```

### Step 2: Setup Backend

```bash
# Navigate to backend
cd library-booking-backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOL
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library-booking
JWT_SECRET=my-super-secret-jwt-key-that-is-at-least-32-characters-long
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
EOL

# Seed database (creates admin, sample libraries, etc.)
npm run seed

# Start backend server
npm start
```

Backend is now running on `http://localhost:5000` ✅

### Step 3: Setup Frontend

Open a new terminal:

```bash
# Navigate to frontend
cd library-booking-frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOL
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
EOL

# Start frontend
npm run dev
```

Frontend is now running on `http://localhost:5173` ✅

### Step 4: Access the Application

Open your browser and go to: `http://localhost:5173`

## 🔑 Test Accounts

Use these credentials to explore different roles:

### Admin Account
```
Email: admin@library.com
Password: Admin@123
```
Access: Full platform management

### Librarian Account
```
Email: raj@library.com
Password: password123
```
Access: Manage own library, time slots, bookings

### User Account
```
Email: john@example.com
Password: password123
```
Access: Browse, book, manage bookings

## 📱 What You Can Do Now

### As a User
1. ✅ Browse featured libraries on homepage
2. ✅ Login/Signup with your credentials
3. ⏳ Search and filter libraries (coming soon)
4. ⏳ View library details (coming soon)
5. ⏳ Book a seat (coming soon)
6. ⏳ View your bookings (coming soon)

### As a Librarian
1. ✅ Login with librarian account
2. ⏳ Add your library (coming soon)
3. ⏳ Manage time slots (coming soon)
4. ⏳ View bookings (coming soon)

### As an Admin
1. ✅ Login with admin account
2. ⏳ Approve pending libraries (coming soon)
3. ⏳ Manage users (coming soon)
4. ⏳ View commission reports (coming soon)

## 🧪 Testing the Backend API

You can test the backend API directly using tools like Postman or curl.

### Example: Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "9999999999",
    "password": "password123",
    "role": "user"
  }'
```

### Example: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@library.com",
    "password": "Admin@123"
  }'
```

### Example: Get Featured Libraries

```bash
curl http://localhost:5000/api/libraries/featured
```

### Example: Get All Libraries (with filters)

```bash
curl "http://localhost:5000/api/libraries?city=Delhi&minPrice=40&maxPrice=70"
```

For authenticated requests, include the token:

```bash
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🛠️ Development Tips

### Backend Development

1. **Watch for changes** (if you have nodemon):
   ```bash
   npm install -g nodemon
   npm run dev
   ```

2. **Reset database**:
   ```bash
   # Drop the database and reseed
   npm run seed
   ```

3. **View logs**:
   - Server logs are printed to console
   - MongoDB connection status is shown on startup

### Frontend Development

1. **Auto-reload**: Vite automatically reloads on file changes

2. **Build for production**:
   ```bash
   npm run build
   ```

3. **Preview production build**:
   ```bash
   npm run preview
   ```

## 📁 Project Structure Overview

```
.
├── library-booking-backend/     # Backend API
│   ├── models/                  # Database models
│   ├── controllers/             # Business logic
│   ├── routes/                  # API routes
│   ├── middleware/              # Auth, validation, etc.
│   ├── config/                  # DB, Cloudinary, Razorpay
│   └── scripts/seed.js          # Database seeding
│
└── library-booking-frontend/    # Frontend React app
    ├── src/
    │   ├── components/          # Reusable components
    │   ├── pages/               # Route pages
    │   ├── services/            # API calls
    │   ├── hooks/               # Custom React hooks
    │   ├── context/             # React context (Auth)
    │   └── utils/               # Helper functions
    └── public/                  # Static assets
```

## 🔍 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
```bash
# Make sure MongoDB is running
sudo systemctl start mongodb
# or
mongod
```

**Port Already in Use**
```bash
# Change PORT in .env file
PORT=5001
```

### Frontend Issues

**Module Not Found**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**API Connection Error**
- Verify backend is running on port 5000
- Check VITE_API_URL in .env file

**Build Errors**
```bash
# Clear cache and rebuild
rm -rf dist
npm run build
```

## 📚 Next Steps

1. **Explore the code**: Check out the well-structured codebase
2. **Read documentation**: See README files in both folders
3. **Test APIs**: Use the backend API directly
4. **Contribute**: Help build the remaining features!

## 🆘 Need Help?

- Check `PROJECT_STATUS.md` for current development status
- See `README.md` in each folder for detailed documentation
- Review the original specifications in the main README

## 🎉 You're All Set!

The backend is fully functional and the frontend foundation is ready. Happy coding! 🚀
