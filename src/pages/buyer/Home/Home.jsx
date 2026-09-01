import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/common/Button/Button';
import './Home.css';

export const Home = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <div className="container">
          <div className="home-nav">
            <div className="home-brand">
              <img src="/logo.png" alt="CraftPass" />
              <span>CraftPass</span>
            </div>
            <div className="home-actions">
              <Link to="/search">
                <Button variant="ghost">Search</Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="home-hero">
        <div className="container">
          <h1 className="heading-1">Verify Authentic Indian Crafts</h1>
          <p className="body-large">
            Discover and verify the authenticity of handcrafted products
            from India's finest artisans.
          </p>
          <div className="home-hero-actions">
            <Link to="/search">
              <Button variant="primary" size="large">Search Products</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="large">Join as Artisan</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};