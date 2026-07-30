import Category from '../models/Category.js';

// @desc    Get all active categories for dropdown
// @route   GET /api/categories
// @access  Protected
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
};