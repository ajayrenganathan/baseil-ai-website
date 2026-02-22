import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Baseil — Get All Your Data Talking'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#0A0F0D',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Large background glow behind mascot */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-5%',
            width: 700,
            height: 700,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(82,183,136,0.14) 0%, rgba(82,183,136,0.04) 40%, transparent 70%)',
          }}
        />
        {/* Secondary glow top right */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '5%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(64,145,108,0.06) 0%, transparent 70%)',
          }}
        />
        {/* Subtle bottom glow */}
        <div
          style={{
            position: 'absolute',
            bottom: '-15%',
            right: '20%',
            width: 500,
            height: 400,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(82,183,136,0.06) 0%, transparent 70%)',
          }}
        />

        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            opacity: 0.03,
            backgroundImage:
              'linear-gradient(rgba(82,183,136,1) 1px, transparent 1px), linear-gradient(90deg, rgba(82,183,136,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Left side — mascot area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36%',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* Glow ring behind mascot */}
          <div
            style={{
              position: 'absolute',
              width: 300,
              height: 300,
              borderRadius: '50%',
              border: '1px solid rgba(82,183,136,0.1)',
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: 400,
              height: 400,
              borderRadius: '50%',
              border: '1px solid rgba(82,183,136,0.05)',
              display: 'flex',
            }}
          />
          <img
            src="https://baseil.ai/robot/robot-leaf.png"
            alt=""
            width={220}
            height={256}
            style={{ objectFit: 'contain', position: 'relative' }}
          />
        </div>

        {/* Vertical divider */}
        <div
          style={{
            position: 'absolute',
            left: '36%',
            top: '12%',
            bottom: '12%',
            width: 1,
            background:
              'linear-gradient(180deg, transparent, rgba(82,183,136,0.2), transparent)',
            display: 'flex',
          }}
        />

        {/* Right side — text content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '64%',
            height: '100%',
            paddingLeft: 50,
            paddingRight: 50,
          }}
        >
          {/* Section label */}
          <div
            style={{
              fontSize: 15,
              letterSpacing: '0.2em',
              color: '#52B788',
              opacity: 0.5,
              marginBottom: 18,
              display: 'flex',
            }}
          >
            // DATA AGENT
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 96,
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: '#C8D8C4',
              marginBottom: 14,
              display: 'flex',
            }}
          >
            Baseil
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 26,
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              color: '#52B788',
              marginBottom: 24,
              display: 'flex',
            }}
          >
            Get all your data talking
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 20,
              color: '#8FAF8A',
              lineHeight: 1.6,
              maxWidth: 540,
              display: 'flex',
            }}
          >
            One data agent. Every database. Ask in plain English, get answers instantly.
          </div>

          {/* Feature pills */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              marginTop: 26,
            }}
          >
            {['Schema Discovery', 'MCP Tools', 'AI Native'].map((tag) => (
              <div
                key={tag}
                style={{
                  fontSize: 13,
                  color: '#52B788',
                  padding: '7px 16px',
                  borderRadius: 20,
                  border: '1px solid rgba(82,183,136,0.15)',
                  background: 'rgba(82,183,136,0.05)',
                  letterSpacing: '0.05em',
                  display: 'flex',
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background:
              'linear-gradient(90deg, transparent, #52B788, transparent)',
            display: 'flex',
          }}
        />

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 44,
            background: 'rgba(17,25,22,0.8)',
            borderTop: '1px solid rgba(82,183,136,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 40,
            paddingRight: 40,
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: '#3D5A3A',
              letterSpacing: '0.08em',
              display: 'flex',
            }}
          >
            baseil.ai
          </div>
          <div
            style={{
              fontSize: 12,
              color: '#3D5A3A',
              opacity: 0.6,
              display: 'flex',
            }}
          >
            The Data Agent for Every Database
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
