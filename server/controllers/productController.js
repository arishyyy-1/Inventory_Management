import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

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

  if (category && category.trim() && category.trim().toLowerCase() !== 'all') {
    filter.category = category.trim();
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
    Product.find(filter).sort(sort).skip(skip).limit(limit),
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
  const product = await Product.findById(req.params.id);

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
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
    data: { id: req.params.id }
  });
});