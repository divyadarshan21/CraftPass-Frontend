import React, { useState, useEffect } from 'react';
import { VerifierLayout } from '../../../components/layout/VerifierLayout/VerifierLayout';
import { StatusBadge } from '../../../components/common/StatusBadge/StatusBadge';
import { Loader } from '../../../components/common/Loader/Loader';
import { EmptyState } from '../../../components/common/EmptyState/EmptyState';
import { formatters } from '../../../utils/formatters';
import './History.css';

export const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setHistory([
        { 
          id: 1, 
          product: 'Handwoven Silk Saree', 
          decision: 'verified',
          date: new Date().toISOString(),
          verifier: 'You',
        },
        { 
          id: 2, 
          product: 'Dhokra Art Sculpture', 
          decision: 'verified',
          date: new Date(Date.now() - 3600000).toISOString(),
          verifier: 'You',
        },
        { 
          id: 3, 
          product: 'Terracotta Pottery Set', 
          decision: 'rejected',
          date: new Date(Date.now() - 7200000).toISOString(),
          verifier: 'You',
          feedback: 'Quality does not meet our standards',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <VerifierLayout>
        <Loader size="large" text="Loading history..." />
      </VerifierLayout>
    );
  }

  return (
    <VerifierLayout>
      <div className="history-page">
        <div className="history-header">
          <h1 className="heading-2">Review History</h1>
          <p className="text-muted">{history.length} reviews completed</p>
        </div>

        {history.length === 0 ? (
          <EmptyState
            title="No review history"
            description="You haven't reviewed any products yet."
            icon="📜"
          />
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item">
                <div className="history-item-info">
                  <div>
                    <h4 className="history-item-name">{item.product}</h4>
                    <div className="history-item-meta">
                      <span>{formatters.timeAgo(item.date)}</span>
                      <span>•</span>
                      <span>by {item.verifier}</span>
                    </div>
                    {item.feedback && (
                      <p className="history-item-feedback">Feedback: {item.feedback}</p>
                    )}
                  </div>
                  <StatusBadge 
                    status={item.decision === 'verified' ? 'verified' : 'rejected'} 
                    size="small" 
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </VerifierLayout>
  );
};