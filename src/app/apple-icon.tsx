import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20px',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: '64px',
            fontWeight: 'bold',
            fontFamily: 'system-ui',
            textAlign: 'center',
          }}
        >
          CAAL
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
