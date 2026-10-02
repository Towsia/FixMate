const Service = require('../models/Service');
const Category = require('../models/Category');

// ==================== Create Service ====================
exports.createService = async (req, res) => {
  try {
    const { title, description, price, categoryId, location } = req.body;

    // Category আছে কিনা চেক করো
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Images (যদি Multer দিয়ে Upload করা হয়)
    const images = req.files ? req.files.map(file => file.path) : [];

    const service = await Service.create({
      title,
      description,
      price,
      categoryId,
      providerId: req.user.id,
      images,
      location
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== Get All Services (Search + Filter + Pagination) ====================
exports.getAllServices = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    // Filter Object তৈরি করো
    let filter = { status: 'active' };

    // Search (Title বা Description এ)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Category Filter
    if (category) {
      filter.categoryId = category;
    }

    // Price Filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Pagination
    const skip = (page - 1) * limit;

    const services = await Service.find(filter)
      .populate('categoryId', 'name icon')
      .populate('providerId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Service.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      services
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== Get Single Service ====================
exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('categoryId', 'name icon')
      .populate('providerId', 'name email phone');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      service
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== Update Service ====================
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // শুধু Owner Update করতে পারবে
    if (service.providerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this service'
      });
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service: updatedService
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== Delete Service ====================
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (service.providerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this service'
      });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== Get My Services (Provider) ====================
exports.getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ providerId: req.user.id })
      .populate('categoryId', 'name icon')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};