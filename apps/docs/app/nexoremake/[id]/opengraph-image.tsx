import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
 
export const alt = 'Nexore Make Component Preview';
export const size = {
  width: 1200,
  height: 630,
};
 
export const contentType = 'image/png';
 
export default async function Image({ params }: { params: { id: string } }) {
  const { id } = params;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Background Decorative Elements */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 60%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            left: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 60%)',
            borderRadius: '50%',
          }}
        />
        
        {/* Logo / Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 24px',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '100px',
            marginBottom: '30px',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)',
          }}
        >
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#a78bfa' }}>
            ✨ Nexore Make
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: '900',
            textAlign: 'center',
            marginBottom: '20px',
            lineHeight: 1.1,
            padding: '0 100px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span>Community Component</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '32px',
            color: '#a1a1aa',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
          }}
        >
          Open to view the live preview and generate React, Vue, or HTML code
        </div>

        {/* Fake Browser window graphic */}
        <div
          style={{
            marginTop: '50px',
            width: '800px',
            height: '200px',
            background: '#030303',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            border: '1px solid #27272a',
            borderBottom: 'none',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', padding: '16px', background: '#09090b', borderBottom: '1px solid #27272a' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', marginRight: '8px' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308', marginRight: '8px' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
          </div>
          <div style={{ flex: 1, backgroundImage: 'radial-gradient(circle, #27272a 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
