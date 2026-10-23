import { ImageResponse } from 'next/og';

export const alt = 'Nexore Make Component Preview';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const subtitle = id === 'shared' ? 'Self-contained component snapshot' : `ID: ${id}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#09090b',
          color: '#fafafa',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '80px 100px',
            height: '100%',
            justifyContent: 'space-between',
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 96,
              height: 96,
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: 24,
            }}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fafafa"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h1
              style={{
                fontSize: 72,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                margin: 0,
                padding: 0,
                color: '#fafafa',
              }}
            >
              Component Preview
            </h1>
            <p
              style={{
                fontSize: 32,
                color: '#a1a1aa',
                margin: 0,
                padding: 0,
                maxWidth: 800,
                fontWeight: 500,
                fontFamily: 'monospace',
              }}
            >
              {subtitle}
            </p>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 80,
            right: 100,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: '#fafafa',
              letterSpacing: '-0.02em',
            }}
          >
            Nexore Make
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
