'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#0B0B0B',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <div>
          <p style={{ letterSpacing: '0.2em', fontSize: 12, color: '#F6C26B', textTransform: 'uppercase' }}>
            UNM
          </p>
          <h1 style={{ fontSize: '1.75rem', margin: '0.75rem 0' }}>Something went wrong</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 420, margin: '0 auto 1.5rem' }}>
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              border: 0,
              borderRadius: 999,
              padding: '0.85rem 1.5rem',
              background: 'linear-gradient(135deg, #F6C26B, #96321C)',
              color: '#1a0f0a',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
