import { Link } from '@tanstack/react-router'
import settings from '@/data/settings.json'

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--clr-border)',
        background: 'var(--clr-surface)',
        marginTop: '4rem',
        padding: '2rem 1.25rem',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          color: 'var(--clr-text-muted)',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-headline)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--clr-text)',
              marginBottom: '0.4rem',
            }}
          >
            {settings.clanName}
          </div>
          <div style={{ fontSize: '0.9rem' }}>{settings.clanTagline}</div>
        </div>

        <div>
          <div className="lg-headline" style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            Navigation
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.9rem' }}>
            <Link to="/roster">Roster</Link>
            <Link to="/events">Events</Link>
            <Link to="/videos">Videos</Link>
            <Link to="/bewerbung">Bewerbung</Link>
            <Link to="/event-anmeldung">Event-Anmeldung</Link>
            <Link to="/kontakt">Kontakt</Link>
          </div>
        </div>

        <div>
          <div className="lg-headline" style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            Community
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.9rem' }}>
            <a href={settings.discordUrl} target="_blank" rel="noreferrer">Discord</a>
            <a href={settings.twitchUrl} target="_blank" rel="noreferrer">Twitch</a>
            <a href={settings.youtubeUrl} target="_blank" rel="noreferrer">YouTube</a>
            <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
          </div>
        </div>

        <div>
          <div className="lg-headline" style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            Intern
          </div>
          {/* Adminbereich ist nur per Direktlink erreichbar – nicht in der Hauptnav. */}
          <Link to="/admin" style={{ fontSize: '0.9rem' }}>Admin-Dashboard</Link>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1280,
          margin: '1.5rem auto 0',
          paddingTop: '1rem',
          borderTop: '1px solid var(--clr-border)',
          fontSize: '0.78rem',
          color: 'var(--clr-text-muted)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.04em',
        }}
      >
        © {new Date().getFullYear()} {settings.clanName} – Built with TanStack Start &amp; Netlify.
      </div>
    </footer>
  )
}
