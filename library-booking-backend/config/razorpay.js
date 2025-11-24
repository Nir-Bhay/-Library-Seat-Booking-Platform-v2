const Razorpay = require('razorpay');

let razorpayInstance = null;

// Only initialize Razorpay if credentials are provided
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  console.log('✅ Razorpay configured successfully');
} else {
  console.warn('⚠️  Razorpay credentials not found. Payment features will be disabled.');
  console.warn('   Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env file to enable payments.');
}

module.exports = razorpayInstance;
