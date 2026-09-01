import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { VerifierLayout } from '../../../components/layout/VerifierLayout/VerifierLayout';
import { StatusBadge } from '../../../components/common/StatusBadge/StatusBadge';
import { Button } from '../../../components/common/Button/Button';
import { Loader } from '../../../components/common/Loader/Loader';
import { EmptyState } from '../../../components/common/EmptyState/EmptyState';
import { formatters } from '../../../utils/formatters';
import './Queue.css';

export const Queue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setQueue([
        { 
          id: 1, 
          name: 'Handwoven Silk Saree', 
          category: 'Textiles',
          artisan: 'Priya Sharma',
          submittedAt: new Date().toISOString(),
          status: 'pending',
          price: 4500,
        },
        { 
          id: 2, 
          name: 'Dhokra Art Sculpture', 
          category: 'Metalwork',
          artisan: 'Ramesh Kumar',
          submittedAt: new Date(Date.now() - 3600000).toISOString(),
          status: 'pending',
          price: 2800,
        },
        { 
          id: 3, 
          name: 'Terracotta Pottery Set', 
          category: 'Pottery',
          artisan: 'Sita Devi',
          submittedAt: new Date(Date.now() - 7200000).toISOString(),
          status: 'pending',
          price: 1200,
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleReview = (id) => {
    toast.success('Opening review for product #' + id);
  };

  if (loading) {
    return (
      <VerifierLayout>
        <Loader size="large" text="Loading queue..." />
      </VerifierLayout>
    );
  }

  return (
    <VerifierLayout>
      <div className="queue-page">
        <div className="queue-header">
          <h1 className="heading-2">Review Queue</h1>
          <p className="text-muted">{queue.length} products pending verification</p>
        </div>

        {queue.length === 0 ? (
          <EmptyState
            title="Queue is empty"
            description="All products have been reviewed."
            icon="✅"
          />
        ) : (
          <div className="queue-list">
            {queue.map((product) => (
              <div key={product.id} className="queue-item">
                <div className="queue-item-info">
                  <div>
                    <h4 className="queue-item-name">{product.name}</h4>
                    <div className="queue-item-meta">
                      <span>{product.category}</span>
                      <span>•</span>
                      <span>by {product.artisan}</span>
                      <span>•</span>
                      <span>₹{formatters.number(product.price)}</span>
                      <span>•</span>
                      <span className="queue-item-time">
                        {formatters.timeAgo(product.submittedAt)}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status="pending" size="small" />
                </div>
                <div className="queue-item-actions">
                  <Link to={`/verifier/submissions/${product.id}`}>
                    <Button variant="primary">Review</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </VerifierLayout>
  );
};