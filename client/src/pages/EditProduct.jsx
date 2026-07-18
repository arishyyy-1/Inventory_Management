import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Loader from '../components/Loader.jsx';
import ProductForm from '../components/ProductForm.jsx';
import { productService } from '../services/api';
import PageTransition from '../components/PageTransition.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import { getReadableError } from '../utils/errorUtils';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProduct(id);
        setProduct(response.data);
      } catch (fetchError) {
        setError(getReadableError(fetchError, 'Unable to load product'));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (productData) => {
    try {
      setIsSubmitting(true);
      setServerError('');
      await productService.updateProduct(id, productData);
      toast.success('Product updated successfully');
      navigate('/products', {
        state: { successMessage: 'Product updated successfully' }
      });
    } catch (updateError) {
      setServerError(getReadableError(updateError, 'Unable to update product'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loader label="Loading product" />;
  }

  if (error) {
    return (
      <PageTransition className="mx-auto max-w-4xl space-y-6">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
        <ErrorMessage message={error} />
      </PageTransition>
    );
  }

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
        <Badge variant="blue">Inventory Item</Badge>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Edit3 className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-normal text-slate-950">
            Edit Product
          </h1>
        </div>
      </div>

      <Card className="p-6">
        <ProductForm
          initialValues={product}
          submitLabel="Update Product"
          onSubmit={handleSubmit}
          serverError={serverError}
          isSubmitting={isSubmitting}
        />
      </Card>
    </PageTransition>
  );
};

export default EditProduct;
