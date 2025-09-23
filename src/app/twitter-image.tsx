import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'CAAL UFC Russas - Centro Acadêmico de Computação'
export const size = {
  width: 1200,
  height: 600,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
          color: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '800px',
            padding: '40px',
          }}
        >
          <h1
            style={{
              fontSize: '42px',
              fontWeight: 'bold',
              margin: '0 0 16px 0',
              lineHeight: 1.1,
            }}
          >
            CAAL UFC Russas
          </h1>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '600',
              margin: '0 0 24px 0',
              opacity: 0.9,
            }}
          >
            Centro Acadêmico de Computação
          </h2>
          <p
            style={{
              fontSize: '18px',
              margin: '0',
              opacity: 0.8,
              lineHeight: 1.3,
            }}
          >
            UFC Campus Russas • Ada Lovelace
          </p>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '30px',
            fontSize: '14px',
            opacity: 0.6,
          }}
        >
          @caal_ufc_russas
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
