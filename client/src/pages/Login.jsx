import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthLayout from '../layouts/AuthLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!values.email.trim()) nextErrors.email = 'Email is required';
    if (!values.password) nextErrors.password = 'Password is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');

    if (!validate()) return;

    setIsSubmitting(true);
    const result = await login(values);
    setIsSubmitting(false);

    if (result.success) {
      navigate(location.state?.from?.pathname || '/', { replace: true });
      return;
    }

    setServerError(result.message);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login to manage protected inventory workflows."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <ErrorMessage message={serverError} />
        <motion.div layout>
          <Input
            icon={Mail}
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={(event) =>
              setValues((current) => ({ ...current, email: event.target.value }))
            }
            error={errors.email}
          />
        </motion.div>
        <motion.div layout>
          <Input
            icon={Lock}
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={values.password}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                password: event.target.value
              }))
            }
            error={errors.password}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
        </motion.div>
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Login
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{' '}
        <Link className="font-semibold text-slate-950 hover:underline" to="/register">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
