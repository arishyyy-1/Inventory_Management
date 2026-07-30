import express from 'express';
import { body, param } from 'express-validator';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

const mongoIdValidator = [
  param('id').isMongoId().withMessage('Invalid product id'),
  validateRequest
];

const productValidators = [
  body('productName')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 120 })
    .withMessage('Product name must be between 2 and 120 characters'),
  body('sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required')
    .isLength({ min: 2, max: 60 })
    .withMessage('SKU must be between 2 and 60 characters'),
  body('category')
  .notEmpty()
  .withMessage('Category is required')
  .isMongoId()
  .withMessage('Invalid category'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 0 })
    .withMessage('Quantity cannot be negative'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),
  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  validateRequest
];

router
  .route('/')
  .get(protect, getProducts)
  .post(
  protect,
  upload.single('image'),
  productValidators,
  createProduct
);

router
  .route('/:id')
  .get(protect, mongoIdValidator, getProductById)
  .put(
  protect,
  upload.single('image'),
  [...mongoIdValidator.slice(0, -1), ...productValidators],
  updateProduct
)
  .delete(protect, mongoIdValidator, deleteProduct);

export default router;
