import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Centro Acadêmico de Computação UFC Campus Russas - Ada Lovelace'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
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
            maxWidth: '900px',
            padding: '40px',
          }}
        >
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              margin: '0 0 20px 0',
              lineHeight: 1.2,
            }}
          >
            Centro Acadêmico de Computação
          </h1>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: '600',
              margin: '0 0 30px 0',
              opacity: 0.9,
            }}
          >
            UFC Campus Russas - Ada Lovelace
          </h2>
          <p
            style={{
              fontSize: '20px',
              margin: '0',
              opacity: 0.8,
              lineHeight: 1.4,
            }}
          >
            Representação estudantil • Eventos • Comunidade acadêmica
          </p>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            fontSize: '16px',
            opacity: 0.7,
          }}
        >
          caal-ufc-russas.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
