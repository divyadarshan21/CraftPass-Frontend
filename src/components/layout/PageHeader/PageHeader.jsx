import React from 'react'
import './PageHeader.css'

export const PageHeader = ({
  title,
  subtitle,
  actions,
  className = '',
  breadcrumbs,
}) => {
  return (
    <header className={`page-header ${className}`}>
      <div className="page-header-content">
        <div className="page-header-left">
          {breadcrumbs && (
            <div className="page-header-breadcrumbs">
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="page-header-breadcrumb">
                  {crumb.link ? (
                    <a href={crumb.link} className="page-header-breadcrumb-link">
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="page-header-breadcrumb-current">
                      {crumb.label}
                    </span>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <span className="page-header-breadcrumb-separator">/</span>
                  )}
                </span>
              ))}
            </div>
          )}

          <h1 className="page-header-title">{title}</h1>
          {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
        </div>

        {actions && <div className="page-header-actions">{actions}</div>}
      </div>
    </header>
  )
}