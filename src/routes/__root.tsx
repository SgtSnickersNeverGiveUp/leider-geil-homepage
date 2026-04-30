import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { NewsTicker } from '@/components/NewsTicker'

import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Leider Geil — Gaming Clan' },
      {
        name: 'description',
        content:
          'Leider Geil – PC-Gaming-Clan für PUBG, ARC Raiders und weitere Multiplayer-Titel. Roster, Events, Videos und Bewerbung.',
      },
    ],
    links: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument() {
  return (
    <html lang="de">
      <head>
        <HeadContent />
        <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
      </head>
      <body>
        <Header />
        <NewsTicker />
        <main style={{ minHeight: 'calc(100vh - 200px)' }}>
          <Outlet />
        </main>
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}
