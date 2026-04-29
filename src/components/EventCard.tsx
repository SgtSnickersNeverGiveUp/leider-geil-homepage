import { Link } from '@tanstack/react-router'
import type { ClanEvent } from '@/lib/types'
import { gameTagClass } from '@/lib/types'

interface Props {
  event: ClanEvent
  showSignup?: boolean
  onEdit?: (e: ClanEvent) => void
  onDelete?: (e: ClanEvent) => void
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function EventCard({ event, showSignup = false, onEdit, onDelete }: Props) {
  return (
    <article
      className="lg-panel"
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      {event.image && (
        <div style={{ aspectRatio: '16 / 7', background: 'var(--clr-surface-alt)' }}>
          <img
            src={event.image}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}
      <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.6rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{event.title}</h3>
          <span className={gameTagClass(event.game)}>{event.game}</span>
        </div>
        <div className="mono" style={{ color: 'var(--clr-text-muted)', fontSize: '0.78rem' }}>
          {formatDate(event.date)}
        </div>
        <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.45 }}>{event.description}</p>

        <div style={{ display: 'flex', gap: '0.4rem', marginTop: 'auto', paddingTop: '0.4rem' }}>
          {showSignup && (
            <Link
              to="/event-anmeldung"
              search={{ event: event.id } as never}
              className="lg-btn lg-btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Für Event anmelden
            </Link>
          )}
          {onEdit && (
            <button className="lg-btn" onClick={() => onEdit(event)} style={{ flex: 1 }}>
              Bearbeiten
            </button>
          )}
          {onDelete && (
            <button className="lg-btn lg-btn-danger" onClick={() => onDelete(event)} style={{ flex: 1 }}>
              Löschen
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
