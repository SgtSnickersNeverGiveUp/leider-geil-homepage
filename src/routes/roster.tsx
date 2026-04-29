import { createFileRoute } from '@tanstack/react-router'
import members from '@/data/members.json'
import type { Member } from '@/lib/types'
import { MemberCard } from '@/components/MemberCard'
import { Modal } from '@/components/Modal'
import { useState } from 'react'
import { gameTagClass } from '@/lib/types'

export const Route = createFileRoute('/roster')({
  component: RosterPage,
})

function RosterPage() {
  const [selected, setSelected] = useState<Member | null>(null)
  const list = members as Member[]

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.25rem' }}>
      <PageHeader
        label="// ROSTER"
        title="Clan Roster"
        subtitle="Wer bei Leider Geil reinhängt – kurz vorgestellt."
      />
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {list.map((m) => (
          <MemberCard key={m.id} member={m} onMore={setSelected} />
        ))}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ''}
      >
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'center' }}>
              <img className="lg-avatar" src={selected.avatar} alt={selected.name} />
              <div>
                <div style={{ fontFamily: 'var(--font-headline)', fontSize: '1.1rem' }}>{selected.role}</div>
                <div className="mono" style={{ color: 'var(--clr-accent-arc)' }}>{selected.clanRole}</div>
              </div>
            </div>
            <p style={{ margin: 0 }}>{selected.bio}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {selected.games.map((g) => (
                <span key={g} className={gameTagClass(g)}>{g}</span>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {selected.funTags.map((t) => (
                <span key={t} className="lg-tag">{t}</span>
              ))}
            </div>
            {/* TODO (later): Link auf eine eigene Member-Detailseite (z.B. /roster/$memberId)
                wenn dort mehr Infos (Statistiken, Streams, Social Links) angezeigt werden sollen. */}
          </div>
        )}
      </Modal>
    </div>
  )
}

export function PageHeader({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: '1.8rem' }}>
      <div className="mono lg-muted" style={{ fontSize: '0.78rem', letterSpacing: '0.18em' }}>{label}</div>
      <h1 style={{ margin: '0.3rem 0 0.4rem', fontSize: '2rem' }}>{title}</h1>
      {subtitle && <p style={{ margin: 0, color: 'var(--clr-text-muted)' }}>{subtitle}</p>}
    </div>
  )
}
