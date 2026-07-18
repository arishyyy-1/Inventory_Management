import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, PackagePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductForm from '../components/ProductForm.jsx';
import { productService } from '../services/api';
import PageTransition from '../components/PageTransition.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import { getReadableError } from '../utils/errorUtils';

const AddProduct = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (productData) => {
    try {
      setIsSubmitting(true);
      setServerError('');
      await productService.createProduct(productData);
      toast.success('Product created successfully');
      navigate('/products', {
        state: { successMessage: 'Product created successfully' }
      });
    } catch (error) {
      setServerError(getReadableError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition className="mx-auto max-w-4xl space-y-6">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>
      <div>
  <Badge
  variant="blue"
  className="px-4 py-1.5 text-sm"
>
  New Inventory Item
</Badge>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
            <PackagePlus className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-normal text-slate-950">
            Add Product
          </h1>
        </div>
      </div>

      <Card className="border border-blue-100 bg-blue-50/20 p-6">
        <ProductForm
          submitLabel="Create Product"
          onSubmit={handleSubmit}
          serverError={serverError}
          isSubmitting={isSubmitting}
        />
      </Card>
    </PageTransition>
  );
};

export default AddProduct;
