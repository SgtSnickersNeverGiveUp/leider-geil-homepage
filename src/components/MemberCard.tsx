import type { Member } from '@/lib/types'
import { gameTagClass } from '@/lib/types'

interface Props {
  member: Member
  onMore?: (m: Member) => void
  onEdit?: (m: Member) => void
  onDelete?: (m: Member) => void
}

export function MemberCard({ member, onMore, onEdit, onDelete }: Props) {
  return (
    <article
      className="lg-panel"
      style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
        <img className="lg-avatar" src={member.avatar} alt={member.name} />
        <div>
          <div
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '1.15rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {member.name}
          </div>
          <div className="lg-muted" style={{ fontSize: '0.85rem' }}>
            {member.role}
          </div>
          <div className="mono" style={{ fontSize: '0.7rem', marginTop: '0.2rem', color: 'var(--clr-accent-arc)' }}>
            {member.clanRole}
          </div>
        </div>
      </div>

      <p style={{ fontSize: '0.92rem', margin: 0, lineHeight: 1.45 }}>{member.bio}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
        {member.games.map((g) => (
          <span key={g} className={gameTagClass(g)}>{g}</span>
        ))}
        {member.funTags.map((t) => (
          <span key={t} className="lg-tag">{t}</span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginTop: 'auto' }}>
        {onMore && (
          <button className="lg-btn" onClick={() => onMore(member)} style={{ flex: 1 }}>
            Mehr Infos
          </button>
        )}
        {onEdit && (
          <button className="lg-btn" onClick={() => onEdit(member)} style={{ flex: 1 }}>
            Bearbeiten
          </button>
        )}
        {onDelete && (
          <button className="lg-btn lg-btn-danger" onClick={() => onDelete(member)} style={{ flex: 1 }}>
            Löschen
          </button>
        )}
      </div>
    </article>
  )
}
