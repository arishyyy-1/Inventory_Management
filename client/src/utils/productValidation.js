export const initialProductForm = {
  productName: '',
  sku: '',
  category: '',
  quantity: '',
  price: '',
  description: ''
};

export const validateProductForm = (values) => {
  const errors = {};

  if (!values.productName.trim()) {
    errors.productName = 'Product name is required';
  }

  if (!values.sku.trim()) {
    errors.sku = 'SKU is required';
  }

  if (!values.category.trim()) {
    errors.category = 'Category is required';
  }

  if (values.quantity === '') {
    errors.quantity = 'Quantity is required';
  } else if (Number(values.quantity) < 0) {
    errors.quantity = 'Quantity cannot be negative';
  }

  if (values.price === '') {
    errors.price = 'Price is required';
  } else if (Number(values.price) < 0) {
    errors.price = 'Price cannot be negative';
  }

  return errors;
};

export const normalizeProductPayload = (values) => ({
  productName: values.productName.trim(),
  sku: values.sku.trim(),
  category: values.category.trim(),
  quantity: Number(values.quantity),
  price: Number(values.price),
  description: values.description.trim()
});
