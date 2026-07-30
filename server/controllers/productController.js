import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const removeLocalImage = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, '../uploads', filename);



  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting local file:', err);
    });
  }
};
const ALLOWED_SORT_FIELDS = ['price', 'quantity', 'productName', 'createdAt'];
const DEFAULT_SORT_FIELD = 'createdAt';
const DEFAULT_ORDER = 'desc';
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parsePositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const buildFilter = (query) => {
  const { search, category, minPrice, maxPrice, minQty, maxQty, availability } = query;
  const filter = {};

  if (search && search.trim()) {
    const searchRegex = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [
      { productName: searchRegex },
      { sku: searchRegex },
      { description: searchRegex }
    ];
  }

 if (category && category !== 'all') {
  filter.category = category;
}

  const minPriceValue = parseNumber(minPrice);
  const maxPriceValue = parseNumber(maxPrice);
  if (minPriceValue !== undefined || maxPriceValue !== undefined) {
    filter.price = {};
    if (minPriceValue !== undefined) filter.price.$gte = minPriceValue;
    if (maxPriceValue !== undefined) filter.price.$lte = maxPriceValue;
  }

  const minQtyValue = parseNumber(minQty);
  const maxQtyValue = parseNumber(maxQty);
  if (minQtyValue !== undefined || maxQtyValue !== undefined) {
    filter.quantity = filter.quantity || {};
    if (minQtyValue !== undefined) filter.quantity.$gte = minQtyValue;
    if (maxQtyValue !== undefined) filter.quantity.$lte = maxQtyValue;
  }

  if (availability === 'in-stock') {
    filter.quantity = { ...(filter.quantity || {}), $gt: 0 };
  } else if (availability === 'out-of-stock') {
    filter.quantity = { ...(filter.quantity || {}), $lte: 0 };
  }

  return filter;
};

const buildSort = (query) => {
  const { sort, order } = query;
  const sortField = ALLOWED_SORT_FIELDS.includes(sort) ? sort : DEFAULT_SORT_FIELD;
  const sortOrder = order === 'asc' ? 1 : -1;

  return { [sortField]: sortOrder, _id: sortOrder };
};

export const getProducts = asyncHandler(async (req, res) => {
  const page = parsePositiveInt(req.query.page, DEFAULT_PAGE);
  const requestedLimit = parsePositiveInt(req.query.limit, DEFAULT_LIMIT);
  const limit = Math.min(requestedLimit, MAX_LIMIT);
  const skip = (page - 1) * limit;

  const filter = buildFilter(req.query);
  const sort = buildSort(req.query);

  const [products, totalProducts] = await Promise.all([
  Product.find(filter)
    .populate('category', 'name description')
    .sort(sort)
    .skip(skip)
    .limit(limit),
  Product.countDocuments(filter)
]);

  const totalPages = totalProducts === 0 ? 0 : Math.ceil(totalProducts / limit);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
    currentPage: page,
    totalPages,
    totalProducts,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1 && page <= totalPages + 1
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  .populate('category', 'name description');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const productData = { ...req.body };

  if (req.file) {
    productData.image = {
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
    };
  }

  try {
    const product = await Product.create(productData);
    await product.populate('category', 'name description');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    if (req.file) removeLocalImage(req.file.filename);
    throw error;
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  const existingProduct = await Product.findById(req.params.id);

  if (!existingProduct) {
    if (req.file) removeLocalImage(req.file.filename);
    res.status(404);
    throw new Error('Product not found');
  }

  const updateData = { ...req.body };

console.log('removeImage:', req.body.removeImage);
console.log('has file:', !!req.file);

  if (req.file) {
    if (existingProduct.image && existingProduct.image.filename) {
      removeLocalImage(existingProduct.image.filename);
    }
    updateData.image = {
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
    };
  }

  if (req.body.removeImage === 'true' && !req.file) {

    if (existingProduct.image && existingProduct.image.filename) {
      removeLocalImage(existingProduct.image.filename);
    }

    updateData.image = {
      url: '',
      filename: '',
    };
 }

  const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  }).populate('category', 'name description');

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.image && product.image.filename) {
    removeLocalImage(product.image.filename);
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
    data: { id: req.params.id }
  });
});