import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout.jsx';
import AddProduct from './pages/AddProduct.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EditProduct from './pages/EditProduct.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import Products from './pages/Products.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Register from './pages/Register.jsx';

const App = () => (
  <>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: 'rgb(var(--surface))',
          color: 'rgb(var(--fg))',
          border: '1px solid rgb(var(--line))',
          borderRadius: '14px',
          boxShadow:
            '0 1px 2px rgba(15,23,42,0.04), 0 12px 30px rgba(15,23,42,0.10)'
        },
        success: { iconTheme: { primary: 'rgb(var(--success))', secondary: 'rgb(var(--surface))' } },
        error: { iconTheme: { primary: 'rgb(var(--danger))', secondary: 'rgb(var(--surface))' } }
      }}
    />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/new" element={<AddProduct />} />
          <Route path="/products/:id/edit" element={<EditProduct />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);

export default App;
