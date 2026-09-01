import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { VerifierLayout } from '../../../components/layout/VerifierLayout/VerifierLayout';
import { StatusBadge } from '../../../components/common/StatusBadge/StatusBadge';
import { Button } from '../../../components/common/Button/Button';
import { useAuth } from '../../../hooks/useAuth';
import './Dashboard.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pending: 0,
    verified: 0,
    rejected: 0,
    total: 0,
  });
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        pending: 8,
        verified: 42,
        rejected: 5,
        total: 55,
      });
      setRecentReviews([
        { id: 1, product: 'Handwoven Silk Saree', status: 'pending', date: '2 mins ago' },
        { id: 2, product: 'Dhokra Art Sculpture', status: 'verified', date: '15 mins ago' },
        { id: 3, product: 'Terracotta Pottery Set', status: 'pending', date: '1 hour ago' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <VerifierLayout>
      <div className="verifier-dashboard">
        <div className="dashboard-header">
          <div>
            <h1 className="heading-2">Verifier Dashboard</h1>
            <p className="text-muted">Welcome back, {user?.name}</p>
          </div>
          <Link to="/verifier/queue">
            <Button variant="accent">Review Queue ({stats.pending})</Button>
          </Link>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div>
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending Review</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div>
              <div className="stat-value">{stats.verified}</div>
              <div className="stat-label">Verified</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❌</div>
            <div>
              <div className="stat-value">{stats.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Reviewed</div>
            </div>
          </div>
        </div>

        <div className="dashboard-recent">
          <h3 className="heading-3">Recent Reviews</h3>
          {loading ? (
            <div className="loading-skeleton">Loading reviews...</div>
          ) : (
            <div className="recent-list">
              {recentReviews.map((review) => (
                <div key={review.id} className="recent-item">
                  <div className="recent-info">
                    <span className="recent-name">{review.product}</span>
                    <StatusBadge status={review.status} size="small" />
                  </div>
                  <span className="recent-date">{review.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </VerifierLayout>
  );
};