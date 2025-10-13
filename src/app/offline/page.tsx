'use client';

import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="offline-page">
      <div className="offline-page__container">
        <div className="offline-page__icon">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="offline-icon"
          >
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
            <line x1="12" y1="20" x2="12.01" y2="20"></line>
          </svg>
        </div>

        <h1 className="offline-page__title">
          You&apos;re Offline
        </h1>

        <p className="offline-page__description">
          It looks like you&apos;ve lost your internet connection. 
          This page requires an active connection to work properly.
        </p>

        <div className="offline-page__actions">
          <button
            onClick={() => window.location.reload()}
            className="offline-page__button offline-page__button--primary"
          >
            Try Again
          </button>
          
          <Link
            href="/"
            className="offline-page__button offline-page__button--secondary"
          >
            Go Home
          </Link>
        </div>

        <div className="offline-page__tips">
          <h2 className="offline-page__tips-title">While you&apos;re offline:</h2>
          <ul className="offline-page__tips-list">
            <li>Check your internet connection</li>
            <li>Try disabling airplane mode</li>
            <li>Check your router or modem</li>
            <li>Move to an area with better signal</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .offline-page {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .offline-page__container {
          max-width: 600px;
          text-align: center;
        }

        .offline-page__icon {
          color: #9ca3af;
          margin-bottom: 2rem;
        }

        .offline-icon {
          margin: 0 auto;
          display: block;
        }

        .offline-page__title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .offline-page__description {
          font-size: 1.125rem;
          color: #6b7280;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .offline-page__actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 3rem;
        }

        .offline-page__button {
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }

        .offline-page__button--primary {
          background: #10b981;
          color: white;
          border: none;
        }

        .offline-page__button--primary:hover {
          background: #059669;
          transform: translateY(-1px);
        }

        .offline-page__button--secondary {
          background: white;
          color: #374151;
          border: 2px solid #d1d5db;
        }

        .offline-page__button--secondary:hover {
          border-color: #9ca3af;
          transform: translateY(-1px);
        }

        .offline-page__tips {
          background: #f9fafb;
          padding: 2rem;
          border-radius: 12px;
          text-align: left;
        }

        .offline-page__tips-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .offline-page__tips-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .offline-page__tips-list li {
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
          color: #4b5563;
        }

        .offline-page__tips-list li::before {
          content: '→';
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: 600;
        }

        @media (max-width: 640px) {
          .offline-page__title {
            font-size: 2rem;
          }

          .offline-page__actions {
            flex-direction: column;
          }

          .offline-page__button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
