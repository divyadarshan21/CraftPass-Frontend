import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth';
import { Input } from '../../../components/common/Input/Input';
import { Button } from '../../../components/common/Button/Button';
import './Login.css';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.name}!`);
      
      // Redirect based on role
      if (user.role === 'artisan') navigate('/artisan/dashboard');
      else if (user.role === 'verifier') navigate('/verifier/dashboard');
      else navigate('/');
    } catch (err) {
      setError('root', { message: err.message });
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <img src="/logo.png" alt="CraftPass" className="login-logo" />
            <h1 className="heading-2">Welcome Back</h1>
            <p className="text-muted">Sign in to manage your craft products</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />

            {errors.root && (
              <p className="login-error">{errors.root.message}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
            >
              Sign In
            </Button>

            <p className="login-footer">
              Don't have an account?{' '}
              <Link to="/register" className="login-link">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};