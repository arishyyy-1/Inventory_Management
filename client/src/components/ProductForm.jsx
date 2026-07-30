import { useEffect, useState } from 'react';
import { Coins, Hash, Layers3, Package, Save, Upload, Warehouse, X } from 'lucide-react';
import {
  initialProductForm,
  normalizeProductPayload,
  validateProductForm
} from '../utils/productValidation';
import ErrorMessage from './ErrorMessage.jsx';
import Button from './ui/Button.jsx';
import Input from './ui/Input.jsx';
import { categoryService } from '../services/api';

const SERVER_URL = (import.meta.env.VITE_API_URL || '').replace('/api', '');

// Helper to extract category ID string if category is a populated object
const extractCategoryId = (cat) => {
  if (!cat) return '';
  if (typeof cat === 'object' && cat._id) return cat._id;
  return cat;
};

const ProductForm = ({
  initialValues = initialProductForm,
  submitLabel = 'Save Product',
  onSubmit,
  serverError = '',
  isSubmitting = false
}) => {
  const [values, setValues] = useState({
    ...initialProductForm,
    ...initialValues,
    category: extractCategoryId(initialValues.category)
  });
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    initialValues?.image?.url ? `${SERVER_URL}${initialValues.image.url}` : null
  );
  const [imageError, setImageError] = useState('');

  // 1. Sync form values when initialValues arrive asynchronously (e.g. Edit Product fetch)
  useEffect(() => {
    if (initialValues) {
      setValues({
        ...initialProductForm,
        ...initialValues,
        category: extractCategoryId(initialValues.category)
      });
      if (initialValues.image?.url) {
        setImagePreview(`${SERVER_URL}${initialValues.image.url}`);
      }
    }
  }, [initialValues]);

  // 2. Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate size (10 MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setImageError('File size exceeds 10 MB limit.');
      return;
    }

    // Validate type (Reject SVG)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setImageError('Invalid format! Allowed: JPG, PNG, GIF, WEBP (SVG is blocked).');
      return;
    }

    setImageError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

 const handleRemoveImage = () => {
  setImageFile(null);
  setImagePreview(null);
  setRemoveExistingImage(true);
  setImageError('');

    
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateProductForm(values);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0 || imageError) return;

    // Normalize form values
    const normalizedPayload = normalizeProductPayload(values);

    // Build FormData payload
    const formData = new FormData();
    Object.entries(normalizedPayload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    // Append image file if new file was selected
if (imageFile) {
  formData.append('image', imageFile);
}

if (removeExistingImage) {
  formData.append('removeImage', 'true');
}

await onSubmit(formData);};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ErrorMessage message={serverError} />

      <div>
        <h2 className="text-lg font-bold tracking-tight text-fg">Product Information</h2>
        <p className="text-sm text-muted">Enter details about the inventory item.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          icon={Package}
          label="Product Name"
          name="productName"
          value={values.productName}
          onChange={handleChange}
          placeholder="Wireless Keyboard"
          error={errors.productName}
          required
        />
        <Input
          icon={Hash}
          label="SKU"
          name="sku"
          value={values.sku}
          onChange={handleChange}
          placeholder="SKU-1001"
          error={errors.sku}
          required
        />

        {/* Category Dropdown */}
        <label className="block space-y-1.5 text-sm font-semibold text-fg">
          Category
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-subtle">
              <Layers3 className="h-5 w-5" />
            </div>
            <select
              className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-3 text-sm text-fg shadow-soft transition-all duration-200 hover:border-brand/40 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
              name="category"
              value={values.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
        </label>

        <Input
          icon={Warehouse}
          label="Quantity"
          min="0"
          name="quantity"
          type="number"
          value={values.quantity}
          onChange={handleChange}
          placeholder="25"
          error={errors.quantity}
          required
        />
        <Input
          icon={Coins}
          label="Price (PKR)"
          min="0"
          name="price"
          step="1"
          type="number"
          value={values.price}
          onChange={handleChange}
          placeholder="7000.00"
          error={errors.price}
          required
        />

        {/* Product Image Input & Preview */}
        <div className="space-y-1.5 text-sm font-semibold text-fg md:col-span-2">
          Product Image
          <div className="mt-1 flex items-center gap-4 rounded-xl border border-line bg-surface p-4 shadow-soft">
            {imagePreview ? (
              <div className="relative h-20 w-20 flex-shrink-0">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="h-20 w-20 rounded-lg object-cover border border-line"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600 transition"
                  title="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg border border-dashed border-line bg-surface/50 text-subtle">
                <Upload className="h-6 w-6" />
              </div>
            )}

            <div className="flex-1 space-y-1">
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="block w-full text-xs text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-brand/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand hover:file:bg-brand/20 cursor-pointer"
              />
              <p className="text-xs text-subtle">JPG, PNG, GIF, WEBP up to 10 MB (SVG blocked)</p>
              {imageError && <p className="text-xs text-red-500">{imageError}</p>}
            </div>
          </div>
        </div>

        {/* Description */}
        <label className="block space-y-1.5 text-sm font-semibold text-fg md:col-span-2">
          Description
          <textarea
            className="min-h-32 w-full resize-y rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-fg shadow-soft transition-all duration-200 placeholder:text-subtle hover:border-brand/40 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
            name="description"
            value={values.description}
            onChange={handleChange}
            placeholder="Short product description"
          />
        </label>
      </div>

      <Button type="submit" icon={Save} isLoading={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
};

export default ProductForm;