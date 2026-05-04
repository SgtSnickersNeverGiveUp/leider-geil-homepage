import type { ClanEvent } from '@/lib/types'

type Props = {
  event: ClanEvent
  showSignup?: boolean
}

export function EventCard({ event, showSignup }: Props) {
  const imageSrc =
    event.image && event.image.startsWith('http')
      ? event.image
      : '/placeholder.png'

  return (
    <div
      className="lg-panel"
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <img
        src={imageSrc}
        alt={event.title}
        style={{ aspectRatio: '16/9', objectFit: 'cover', width: '100%' }}
      />
      <div
        style={{
          padding: '0.8rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          flex: 1,
        }}
      >
        <div style={{ fontWeight: 600 }}>{event.title}</div>
        <div className="mono lg-muted" style={{ fontSize: '0.78rem' }}>
          {new Date(event.date).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}{' '}
          · {event.game}
        </div>
        {event.description && (
          <div style={{ fontSize: '0.9rem', color: 'var(--clr-text)' }}>
            {event.description}
          </div>
        )}
        {showSignup && (
          <button
            className="lg-btn lg-btn-primary"
            style={{ marginTop: 'auto' }}
            type="button"
          >
            Anmelden
          </button>
        )}
      </div>
    </div>
  )
}
