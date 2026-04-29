import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import settings from '@/data/settings.json'
import { OnlineLamp } from './OnlineLamp'

/**
 * Globaler Header inkl. Navigation.
 * - Desktop: horizontale Nav + Discord/Twitch-Buttons mit Online-Lampe.
 * - Mobile: einklappbares Menü.
 *
 * TODO (later): Aktiver Login-Status (Member/Admin) anzeigen,
 * sobald Auth (z.B. Netlify Identity) angebunden ist.
 */

const navItems = [
  { to: '/', label: 'Start' },
  { to: '/roster', label: 'Roster' },
  { to: '/events', label: 'Events' },
  { to: '/videos', label: 'Videos' },
  { to: '/bewerbung', label: 'Bewerbung' },
  { to: '/event-anmeldung', label: 'Event-Anmeldung' },
  { to: '/kontakt', label: 'Kontakt' },
] as const

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header
      style={{
        background: 'rgba(13, 13, 18, 0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--clr-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/* Logo / Clanname */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontFamily: 'var(--font-headline)',
            fontWeight: 700,
            fontSize: '1.4rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--clr-text)',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 12,
              height: 12,
              background: 'var(--clr-accent-arc)',
              boxShadow: '0 0 12px rgba(15, 242, 169, 0.7)',
              transform: 'rotate(45deg)',
            }}
          />
          <span>
            {settings.clanName.split(' ')[0]}{' '}
            <span style={{ color: 'var(--clr-accent-arc)' }}>
              {settings.clanName.split(' ').slice(1).join(' ')}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Hauptnavigation"
          className="lg-desktop-nav"
          style={{ display: 'none' }}
        >
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ style: { color: 'var(--clr-accent-arc)' } }}
              style={{
                color: 'var(--clr-text)',
                fontFamily: 'var(--font-headline)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '0.92rem',
                padding: '0.4rem 0.7rem',
              }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Discord / Twitch */}
        <div
          className="lg-social-bar"
          style={{ display: 'none', alignItems: 'center', gap: '0.6rem' }}
        >
          <a
            href={settings.discordUrl}
            target="_blank"
            rel="noreferrer"
            className="lg-btn"
            style={{ padding: '0.45rem 0.8rem', fontSize: '0.78rem' }}
          >
            <OnlineLamp label="Discord online" /> Discord
          </a>
          <a
            href={settings.twitchUrl}
            target="_blank"
            rel="noreferrer"
            className="lg-btn"
            style={{ padding: '0.45rem 0.8rem', fontSize: '0.78rem' }}
          >
            <OnlineLamp label="Twitch online" /> Twitch
          </a>
        </div>

        {/* Mobile burger */}
        <button
          className="lg-burger"
          aria-label="Menü öffnen"
          onClick={() => setOpen((v) => !v)}
          style={{
            display: 'inline-flex',
            background: 'transparent',
            border: '1px solid var(--clr-border)',
            color: 'var(--clr-text)',
            padding: '0.45rem 0.7rem',
            borderRadius: 8,
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
          }}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          style={{
            borderTop: '1px solid var(--clr-border)',
            background: 'var(--clr-surface)',
            padding: '0.5rem 1rem 1rem',
          }}
        >
          <nav
            aria-label="Mobile Navigation"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}
          >
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeProps={{ style: { color: 'var(--clr-accent-arc)' } }}
                style={{
                  padding: '0.7rem 0.4rem',
                  borderBottom: '1px solid var(--clr-border)',
                  color: 'var(--clr-text)',
                  fontFamily: 'var(--font-headline)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {n.label}
              </Link>
            ))}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.7rem' }}>
              <a
                href={settings.discordUrl}
                target="_blank"
                rel="noreferrer"
                className="lg-btn"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <OnlineLamp /> Discord
              </a>
              <a
                href={settings.twitchUrl}
                target="_blank"
                rel="noreferrer"
                className="lg-btn"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <OnlineLamp /> Twitch
              </a>
            </div>
          </nav>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .lg-desktop-nav { display: flex !important; gap: 0.2rem; }
          .lg-social-bar  { display: flex !important; }
          .lg-burger      { display: none !important; }
        }
      `}</style>
    </header>
  )
}
