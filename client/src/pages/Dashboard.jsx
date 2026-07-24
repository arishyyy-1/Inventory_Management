import { Link, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Layers3,
  PackagePlus,
  PackageX,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Skeleton from '../components/Skeleton.jsx';
import { useProducts } from '../hooks/useProducts';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext.jsx';
import PageTransition from '../components/PageTransition.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';

const LOW_STOCK_THRESHOLD = 5;

/* ---------- Small chart primitives (no new deps) ---------- */

const BarChart = ({ series, height = 180 }) => {
  const max = Math.max(1, ...series.map((d) => d.value));
  return (
    <div className="w-full">
      <div
        className="flex items-end gap-2"
        style={{ height }}
        role="img"
        aria-label="Products added per day"
      >
        {series.map((d) => {
          const h = Math.max(4, (d.value / max) * height);
          return (
            <div key={d.label} className="group flex flex-1 flex-col items-center gap-2">
              <div className="relative w-full">
                <div
                  className="mx-auto w-full max-w-8 rounded-t-lg bg-brand/20 transition-all duration-300 group-hover:bg-brand"
                  style={{ height: h }}
                  title={`${d.label}: ${d.value}`}
                />
                <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-fg px-2 py-0.5 text-[10px] font-semibold text-bg opacity-0 shadow-lift transition-opacity duration-200 group-hover:opacity-100">
                  {d.value}
                </div>
              </div>
              <span className="text-[10px] font-medium text-muted">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DonutStat = ({ value, total, color, label }) => {
  const pct = total ? Math.round((value / total) * 100) : 0;
  const dash = 2 * Math.PI * 28;
  const filled = (pct / 100) * dash;
  return (
    <div className="flex items-center gap-4">
      <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
        <circle cx="36" cy="36" r="28" strokeWidth="8" className="stroke-line" fill="none" />
        <circle
          cx="36"
          cy="36"
          r="28"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          stroke={color}
          strokeDasharray={`${filled} ${dash}`}
          transform="rotate(-90 36 36)"
          style={{ transition: 'stroke-dasharray 500ms ease' }}
        />
        <text
          x="36"
          y="40"
          textAnchor="middle"
          className="fill-fg text-sm font-bold"
        >
          {pct}%
        </text>
      </svg>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-fg">{value}</p>
      </div>
    </div>
  );
};

/* ---------- Dashboard ---------- */

const Dashboard = () => {
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const { user } = useAuth();

  const {
    inventoryValue,
    categoriesCount,
    inStockCount,
    lowStockCount,
    outOfStockCount,
    productsPerDay,
    recentActivity,
    recentProducts
  } = useMemo(() => {
    const inventoryValue = products.reduce(
      (sum, p) => sum + Number(p.quantity || 0) * Number(p.price || 0),
      0
    );
    const categoriesCount = new Set(products.map((p) => p.category)).size;
    const outOfStockCount = products.filter((p) => Number(p.quantity || 0) === 0).length;
    const lowStockCount = products.filter((p) => {
      const q = Number(p.quantity || 0);
      return q > 0 && q <= LOW_STOCK_THRESHOLD;
    }).length;
    const inStockCount = products.filter(
      (p) => Number(p.quantity || 0) > LOW_STOCK_THRESHOLD
    ).length;

    // Products added per day (last 7 days) from createdAt.
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0);
      days.push(d);
    }
    const productsPerDay = days.map((d) => {
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      const count = products.filter((p) => {
        if (!p.createdAt) return false;
        const t = new Date(p.createdAt).getTime();
        return t >= d.getTime() && t < next.getTime();
      }).length;
      return {
        label: d.toLocaleDateString(undefined, { weekday: 'short' }),
        value: count
      };
    });

    const recentActivity = [...products]
      .filter((p) => p.updatedAt || p.createdAt)
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 6)
      .map((p) => {
        const qty = Number(p.quantity || 0);
        const isNew =
          p.createdAt && p.updatedAt && new Date(p.createdAt).getTime() === new Date(p.updatedAt).getTime();
        return {
          id: p._id,
          title: p.productName,
          subtitle: `${p.sku} · ${p.category}`,
          time: p.updatedAt || p.createdAt,
          status:
            qty === 0
              ? { variant: 'danger', label: 'Out of stock' }
              : qty <= LOW_STOCK_THRESHOLD
              ? { variant: 'warning', label: 'Low stock' }
              : { variant: 'success', label: 'In stock' },
          kind: isNew ? 'created' : 'updated'
        };
      });

    const recentProducts = [...products]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);

    return {
      inventoryValue,
      categoriesCount,
      inStockCount,
      lowStockCount,
      outOfStockCount,
      productsPerDay,
      recentActivity,
      recentProducts
    };
  }, [products]);

  const totalStock = inStockCount + lowStockCount + outOfStockCount;
  const hasAnyCreatedAt = productsPerDay.some((d) => d.value > 0);

  const kpis = [
    {
      label: 'Total Products',
      value: products.length,
      icon: Boxes,
      accent: 'text-brand bg-brand-soft',
      trend: { dir: 'up', text: `${productsPerDay.slice(-3).reduce((a, b) => a + b.value, 0)} added recently` }
    },
    {
      label: 'Inventory Value',
      value: formatCurrency(inventoryValue),
      icon: TrendingUp,
      accent: 'text-success bg-success-soft',
      trend: { dir: 'up', text: 'Total portfolio value' }
    },
    {
      label: 'Categories',
      value: categoriesCount,
      icon: Layers3,
      accent: 'text-brand bg-brand-soft',
      trend: null
    },
    {
      label: 'Needs Attention',
      value: lowStockCount + outOfStockCount,
      icon: Sparkles,
      accent: 'text-warn bg-warn-soft',
      trend:
        lowStockCount + outOfStockCount > 0
          ? { dir: 'up', text: `${outOfStockCount} out · ${lowStockCount} low` }
          : { dir: 'down', text: 'All healthy' }
    }
  ];

  if (loading) {
    return (
      <PageTransition className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          <Skeleton className="h-72 w-full lg:col-span-2" />
          <Skeleton className="h-72 w-full" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="space-y-8">
      {/* Hero */}
      <Card className="relative overflow-hidden p-6 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(circle at 0% 0%, rgb(var(--brand) / 0.10), transparent 40%), radial-gradient(circle at 100% 100%, rgb(var(--brand) / 0.06), transparent 40%)'
          }}
        />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge variant="blue">Authenticated Workspace</Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
              Welcome back, {user?.fullName?.split(' ')[0] || 'there'}
            </h1>
            <p className="mt-3 max-w-2xl text-muted">
              Track value, categories, and stock health from one clean dashboard.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button icon={PackagePlus} onClick={() => navigate('/products/new')}>
              Add Product
            </Button>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-fg shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/50 hover:text-brand"
            >
              View Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Card>

      <ErrorMessage message={error} />

      {/* KPI grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="kpi-card" delay={index * 0.05}>
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold text-muted">{kpi.label}</p>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-5 text-3xl font-bold tabular-nums tracking-tight text-fg">
                {kpi.value}
              </p>
              {kpi.trend && (
                <div
                  className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold ${
                    kpi.trend.dir === 'up' ? 'text-success' : 'text-muted'
                  }`}
                >
                  <ArrowUpRight
                    className={`h-3.5 w-3.5 ${kpi.trend.dir === 'up' ? '' : 'rotate-180'}`}
                  />
                  {kpi.trend.text}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Chart + Stock Health */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-fg">
                Products added per day
              </h2>
              <p className="text-sm text-muted">Last 7 days</p>
            </div>
            <Badge variant="blue" className="self-start">
              <Activity className="h-3.5 w-3.5" /> Live
            </Badge>
          </div>
          <div className="mt-6">
            {hasAnyCreatedAt ? (
              <BarChart series={productsPerDay} />
            ) : (
              <div className="flex h-44 items-center justify-center rounded-xl border border-dashed border-line text-sm text-muted">
                No timestamped data yet — chart will populate as products are added.
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-fg">Stock Health</h2>
              <p className="text-sm text-muted">Click a segment to filter</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <StockRow
              icon={CheckCircle2}
              label="In Stock"
              value={inStockCount}
              total={totalStock}
              variant="success"
              onClick={() => navigate('/products?availability=in-stock')}
            />
            <StockRow
              icon={AlertTriangle}
              label="Low Stock"
              value={lowStockCount}
              total={totalStock}
              variant="warning"
              onClick={() => navigate('/products?availability=low-stock')}
            />
            <StockRow
              icon={PackageX}
              label="Out of Stock"
              value={outOfStockCount}
              total={totalStock}
              variant="danger"
              onClick={() => navigate('/products?availability=out-of-stock')}
            />
          </div>
        </Card>
      </div>

      {/* Activity + Recent Products */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-fg">Recent Activity</h2>
            <Badge variant="neutral">{recentActivity.length}</Badge>
          </div>
          <ol className="mt-5 space-y-4">
            {recentActivity.map((a, idx) => (
              <li key={a.id} className="flex gap-3">
                <div className="relative flex flex-col items-center">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface ${
                      a.status.variant === 'success'
                        ? 'text-success'
                        : a.status.variant === 'warning'
                        ? 'text-warn'
                        : 'text-danger'
                    }`}
                  >
                    {a.kind === 'created' ? (
                      <PackagePlus className="h-4 w-4" />
                    ) : (
                      <Activity className="h-4 w-4" />
                    )}
                  </span>
                  {idx < recentActivity.length - 1 && (
                    <span className="mt-1 h-full w-px flex-1 bg-line" />
                  )}
                </div>
                <div className="min-w-0 flex-1 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-fg">{a.title}</p>
                    <Badge variant={a.status.variant}>{a.status.label}</Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted">{a.subtitle}</p>
                  <p className="mt-1 text-xs text-subtle">{formatDate(a.time)}</p>
                </div>
              </li>
            ))}
            {recentActivity.length === 0 && (
              <li className="text-sm text-muted">No activity yet.</li>
            )}
          </ol>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-fg">Recent Products</h2>
              <p className="text-sm text-muted">Latest inventory records</p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-line">
            <table className="min-w-full">
              <thead className="bg-surface-2">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-muted">
                    Product
                  </th>
                  <th className="hidden px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-muted sm:table-cell">
                    Category
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-bold uppercase tracking-wide text-muted">
                    Stock
                  </th>
                  <th className="hidden px-4 py-2.5 text-right text-xs font-bold uppercase tracking-wide text-muted sm:table-cell">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {recentProducts.map((p, i) => {
                  const qty = Number(p.quantity || 0);
                  const variant =
                    qty === 0 ? 'danger' : qty <= LOW_STOCK_THRESHOLD ? 'warning' : 'success';
                  return (
                    <tr
                      key={p._id}
                      className={`row-hover ${i % 2 === 1 ? 'bg-surface-2/50' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <p className="font-semibold text-fg">{p.productName}</p>
                        <p className="text-xs text-muted">{p.sku}</p>
                      </td>
                      <td className="hidden px-4 py-3 text-sm text-muted sm:table-cell">
                        {p.category}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge variant={variant}>{qty} units</Badge>
                      </td>
                      <td className="hidden px-4 py-3 text-right text-sm font-semibold text-fg sm:table-cell tabular-nums">
                        {formatCurrency(p.price)}
                      </td>
                    </tr>
                  );
                })}
                {recentProducts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-sm text-muted">
                      No products yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
};

const StockRow = ({ icon: Icon, label, value, total, variant, onClick }) => {
  const pct = total ? Math.round((value / total) * 100) : 0;
  const colorMap = {
    success: { text: 'text-success', bar: 'bg-success', soft: 'bg-success-soft' },
    warning: { text: 'text-warn', bar: 'bg-warn', soft: 'bg-warn-soft' },
    danger: { text: 'text-danger', bar: 'bg-danger', soft: 'bg-danger-soft' }
  }[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-xl border border-line bg-surface p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-soft"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${colorMap.soft} ${colorMap.text}`}>
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-fg">{label}</p>
            <p className="text-xs text-muted">{value} product{value === 1 ? '' : 's'}</p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand" />
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className={`h-full rounded-full ${colorMap.bar} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </button>
  );
};

export default Dashboard;
