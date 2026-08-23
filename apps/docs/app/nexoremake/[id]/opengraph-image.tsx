import { ImageResponse } from 'next/og';

export const alt = 'Nexore Make Component Preview';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#09090b',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Background Gradients */}
        <div style={{ position: 'absolute', top: -300, left: -200, width: 800, height: 800, background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -200, right: -200, width: 800, height: 800, background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)' }} />
        
        {/* Hex/Grid Pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Content Container */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '80px 100px', height: '100%', justifyContent: 'space-between', zIndex: 10 }}>
          
          {/* Logo Box */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: 100, 
            height: 100, 
            backgroundColor: 'rgba(24,24,27,0.7)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: 28, 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' 
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h1 style={{ fontSize: 80, fontWeight: 800, letterSpacing: '-0.02em', margin: 0, padding: 0, color: '#ffffff' }}>
              Component Preview
            </h1>
            <p style={{ fontSize: 36, color: '#a1a1aa', margin: 0, padding: 0, maxWidth: 800, fontWeight: 500, fontFamily: 'monospace' }}>
              ID: {id}
            </p>
          </div>
        </div>

        {/* Bottom Right Watermark */}
        <div style={{ position: 'absolute', bottom: 80, right: 100, display: 'flex', alignItems: 'center', gap: 12, zIndex: 10 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>Nexore Make</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
