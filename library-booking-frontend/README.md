# Library Seat Booking Platform - Frontend

A modern React-based frontend application for the Library Seat Booking Platform built with Vite, React Router, and Tailwind CSS.

## Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Authentication**: User registration, login, and role-based access
- **Library Search**: Browse and filter libraries by location, price, and amenities
- **Booking System**: Select dates, time slots, and seats
- **Payment Integration**: Razorpay payment gateway
- **Dashboard**: Separate dashboards for users, librarians, and admins
- **Real-time Updates**: React Query for efficient data fetching and caching

## Tech Stack

- React.js v18+ with Vite
- React Router DOM v6
- Tailwind CSS for styling
- React Hook Form + Zod validation
- Axios for API calls
- React Query (@tanstack/react-query) for state management
- date-fns for date formatting
- react-hot-toast for notifications
- Lucide React for icons

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory (see `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

### 3. Start Development Server

```bash
npm run dev
```

The application will run on `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## License

ISC
