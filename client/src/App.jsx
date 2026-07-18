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
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 18px 45px rgba(15, 23, 42, 0.12)'
        }
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
