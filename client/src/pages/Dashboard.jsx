import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Boxes,
  Layers3,
  PackagePlus,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Skeleton from '../components/Skeleton.jsx';
import { useProducts } from '../hooks/useProducts';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext.jsx';
import PageTransition from '../components/PageTransition.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const { user } = useAuth();

  const inventoryValue = products.reduce(
    (sum, product) =>
      sum + Number(product.quantity || 0) * Number(product.price || 0),
    0
  );
  const categoriesCount = new Set(products.map((product) => product.category)).size;
  const lowStockCount = products.filter((product) => Number(product.quantity || 0) <= 5).length;

  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      icon: Boxes,
      tone: 'bg-blue-50 text-blue-700'
    },
    {
      label: 'Inventory Value',
      value: formatCurrency(inventoryValue),
      icon: TrendingUp,
      tone: 'bg-emerald-50 text-emerald-700'
    },
    {
      label: 'Categories Count',
      value: categoriesCount,
      icon: Layers3,
      tone: 'bg-violet-50 text-violet-700'
    },
    {
      label: 'Low Stock',
      value: lowStockCount,
      icon: Sparkles,
      tone: 'bg-amber-50 text-amber-700'
    }
  ];

  if (loading) {
    return (
      <PageTransition className="space-y-6">
        <Skeleton className="h-44 w-full" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="space-y-8">
      <Card className="overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge variant="blue">Authenticated Dashboard</Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
              Welcome back, {user?.fullName?.split(' ')[0] || 'User'}
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Your protected inventory workspace is ready. Track value,
              categories, and stock health from one clean dashboard.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button icon={PackagePlus} onClick={() => navigate('/products/new')}>
              Add Product
            </Button>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              View Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-blue-700 tracking-wide">
            Inventory Overview
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-normal text-slate-950">
            Performance Snapshot
          </h2>
        </div>
      </div>

      <ErrorMessage message={error} />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label} className="p-5" delay={index * 0.05}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-5 text-3xl font-bold text-slate-950">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Recent Products
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Latest inventory records added to the system.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 divide-y divide-slate-100">
          {products.slice(0, 5).map((product) => (
            <div
              key={product._id}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-slate-900">
                  {product.productName}
                </p>
                <p className="text-sm text-slate-500">{product.sku}</p>
              </div>
              <Badge variant={Number(product.quantity) <= 5 ? 'warning' : 'success'}>
                {product.quantity} units
              </Badge>
            </div>
          ))}

          {products.length === 0 && (
            <p className="py-6 text-sm text-slate-500">
              No recent products to show.
            </p>
          )}
        </div>
      </Card>
    </PageTransition>
  );
};

export default Dashboard;
