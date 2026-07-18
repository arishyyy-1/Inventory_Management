import { useState } from 'react';
import { DollarSign, Hash, Layers3, Package, Save, Warehouse } from 'lucide-react';
import {
  initialProductForm,
  normalizeProductPayload,
  validateProductForm
} from '../utils/productValidation';
import ErrorMessage from './ErrorMessage.jsx';
import Button from './ui/Button.jsx';
import Input from './ui/Input.jsx';

const ProductForm = ({
  initialValues = initialProductForm,
  submitLabel = 'Save Product',
  onSubmit,
  serverError = '',
  isSubmitting = false
}) => {
  const [values, setValues] = useState({
    ...initialProductForm,
    ...initialValues
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((currentValues) => ({
      ...currentValues,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateProductForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    await onSubmit(normalizeProductPayload(values));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ErrorMessage message={serverError} />

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
        <Input
          icon={Layers3}
          label="Category"
          name="category"
          value={values.category}
          onChange={handleChange}
          placeholder="Accessories"
          error={errors.category}
          required
        />
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
          icon={DollarSign}
          label="Price"
          min="0"
          name="price"
          step="0.01"
          type="number"
          value={values.price}
          onChange={handleChange}
          placeholder="49.99"
          error={errors.price}
          required
        />

        <label className="block space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
          Description
          <textarea
            className="min-h-32 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm transition placeholder:text-slate-400 focus:border-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-200"
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
