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
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ max: 80 })
    .withMessage('Category cannot exceed 80 characters'),
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

router.route('/').get(getProducts).post(protect, productValidators, createProduct);
router
  .route('/:id')
  .get(mongoIdValidator, getProductById)
  .put(
    protect,
    [...mongoIdValidator.slice(0, -1), ...productValidators],
    updateProduct
  )
  .delete(protect, mongoIdValidator, deleteProduct);

export default router;
