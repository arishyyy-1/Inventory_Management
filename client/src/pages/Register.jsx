import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, UserRound } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [values, setValues] = useState({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!values.fullName.trim()) nextErrors.fullName = 'Name is required';
    if (!values.email.trim()) nextErrors.email = 'Email is required';
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) {
      nextErrors.email = 'Enter a valid email address';
    }
    if (!values.password) nextErrors.password = 'Password is required';
    if (values.password && values.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');
    if (!validate()) return;
    setIsSubmitting(true);
    const result = await register(values);
    setIsSubmitting(false);
    if (result.success) {
      navigate('/', { replace: true });
      return;
    }
    setServerError(result.message);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start a secure inventory workspace in a few seconds."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <ErrorMessage message={serverError} />
        <Input
          icon={UserRound}
          label="Full Name"
          name="fullName"
          autoComplete="name"
          placeholder="Ayesha Khan"
          value={values.fullName}
          onChange={handleChange}
          error={errors.fullName}
        />
        <Input
          icon={Mail}
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Input
          icon={Lock}
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Minimum 8 characters"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="rounded-md p-1 text-subtle transition hover:bg-surface-2 hover:text-fg"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Create Account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link className="font-semibold text-brand hover:underline" to="/login">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
