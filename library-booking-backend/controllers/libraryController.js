const Library = require('../models/Library');
const cloudinary = require('../config/cloudinary');

// Helper function to parse address from FormData
const parseAddressFromFormData = (reqBody) => {
  if (typeof reqBody.address === 'string') {
    return JSON.parse(reqBody.address);
  } else if (reqBody['address[street]']) {
    return {
      street: reqBody['address[street]'] || '',
      area: reqBody['address[area]'] || '',
      city: reqBody['address[city]'] || '',
      state: reqBody['address[state]'] || '',
      pincode: reqBody['address[pincode]'] || '',
      landmark: reqBody['address[landmark]'] || ''
    };
  }
  return reqBody.address;
};

// @desc    Get all approved libraries with filters
// @route   GET /api/libraries
// @access  Public
const getLibraries = async (req, res) => {
  try {
    const {
      city,
      area,
      minPrice,
      maxPrice,
      amenities,
      sort = '-createdAt',
      page = 1,
      limit = 10,
      search
    } = req.query;

    // Build query
    const query = { isApproved: true, isActive: true };

    if (city) query['address.city'] = new RegExp(city, 'i');
    if (area) query['address.area'] = new RegExp(area, 'i');
    if (minPrice || maxPrice) {
      query.pricePerHour = {};
      if (minPrice) query.pricePerHour.$gte = Number(minPrice);
      if (maxPrice) query.pricePerHour.$lte = Number(maxPrice);
    }
    if (amenities) {
      const amenityArray = amenities.split(',');
      query.amenities = { $in: amenityArray };
    }
    if (search) {
      query.$or = [
        { libraryName: new RegExp(search, 'i') },
        { 'address.city': new RegExp(search, 'i') },
        { 'address.area': new RegExp(search, 'i') }
      ];
    }

    const libraries = await Library.find(query)
      .populate('amenities', 'name icon category')
      .populate('librarian_id', 'fullName email phone')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Library.countDocuments(query);

    res.status(200).json({
      success: true,
      data: libraries,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get featured libraries
// @route   GET /api/libraries/featured
// @access  Public
const getFeaturedLibraries = async (req, res) => {
  try {
    const libraries = await Library.find({ isApproved: true, isActive: true })
      .populate('amenities', 'name icon category')
      .sort({ averageRating: -1, totalReviews: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: libraries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single library
// @route   GET /api/libraries/:id
// @access  Public
const getLibrary = async (req, res) => {
  try {
    const library = await Library.findById(req.params.id)
      .populate('amenities', 'name icon category')
      .populate('librarian_id', 'fullName email phone');

    if (!library) {
      return res.status(404).json({
        success: false,
        error: 'Library not found'
      });
    }

    res.status(200).json({
      success: true,
      data: library
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create library
// @route   POST /api/libraries
// @access  Private (Librarian)
const createLibrary = async (req, res) => {
  try {
    const libraryData = {
      ...req.body,
      librarian_id: req.user._id
    };

    // Handle image uploads if files are present
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      
      for (const file of req.files) {
        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'library-bookings/libraries' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(file.buffer);
        });
        
        imageUrls.push(result.secure_url);
      }
      
      libraryData.images = imageUrls;
      if (imageUrls.length > 0) {
        libraryData.coverImage = imageUrls[0];
      }
    }

    // Parse amenities if it's a string
    if (typeof libraryData.amenities === 'string') {
      libraryData.amenities = JSON.parse(libraryData.amenities);
    }

    // Parse daysOpen if it's a string
    if (typeof libraryData.daysOpen === 'string') {
      libraryData.daysOpen = JSON.parse(libraryData.daysOpen);
    }

    // Parse address using helper function
    libraryData.address = parseAddressFromFormData(req.body);

    const library = await Library.create(libraryData);

    res.status(201).json({
      success: true,
      data: library,
      message: 'Library submitted for admin approval'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update library
// @route   PUT /api/libraries/:id
// @access  Private (Librarian - own library only)
const updateLibrary = async (req, res) => {
  try {
    let library = await Library.findById(req.params.id);

    if (!library) {
      return res.status(404).json({
        success: false,
        error: 'Library not found'
      });
    }

    // Check if user owns this library
    if (library.librarian_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this library'
      });
    }

    const updateData = { ...req.body };

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'library-bookings/libraries' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(file.buffer);
        });
        
        imageUrls.push(result.secure_url);
      }
      
      updateData.images = [...(library.images || []), ...imageUrls];
      if (!updateData.coverImage && imageUrls.length > 0) {
        updateData.coverImage = imageUrls[0];
      }
    }

    // Parse JSON strings if needed
    if (typeof updateData.amenities === 'string') {
      updateData.amenities = JSON.parse(updateData.amenities);
    }
    if (typeof updateData.daysOpen === 'string') {
      updateData.daysOpen = JSON.parse(updateData.daysOpen);
    }
    
    // Parse address using helper function
    updateData.address = parseAddressFromFormData(req.body);

    library = await Library.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: library
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete library
// @route   DELETE /api/libraries/:id
// @access  Private (Librarian - own library only)
const deleteLibrary = async (req, res) => {
  try {
    const library = await Library.findById(req.params.id);

    if (!library) {
      return res.status(404).json({
        success: false,
        error: 'Library not found'
      });
    }

    // Check if user owns this library
    if (library.librarian_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this library'
      });
    }

    await library.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Library deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get librarian's libraries
// @route   GET /api/libraries/my-libraries
// @access  Private (Librarian)
const getMyLibraries = async (req, res) => {
  try {
    const libraries = await Library.find({ librarian_id: req.user._id })
      .populate('amenities', 'name icon category')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: libraries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getLibraries,
  getFeaturedLibraries,
  getLibrary,
  createLibrary,
  updateLibrary,
  deleteLibrary,
  getMyLibraries
};
