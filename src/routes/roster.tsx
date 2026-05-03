import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import type { Member } from '@/lib/types'
import { MemberCard } from '@/components/MemberCard'
import { Modal } from '@/components/Modal'
import { gameTagClass } from '@/lib/types'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/roster')({
  component: RosterPage,
})

function RosterPage() {
  const [selected, setSelected] = useState<Member | null>(null)
  const [list, setList] = useState<Member[]>([])

  // Daten live von Supabase laden
  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Fehler beim Laden:', error)
      } else {
        setList((data || []) as Member[])
      }
    }

    fetchMembers()
  }, [])

  return (
    <>
      <PageHeader
        label="ROSTER"
        title="Unsere Mitglieder"
        subtitle="Leider Geil – Squad, Support & Friends."
      />

      <div
        style={{
          display: 'grid',
          gap: '1.2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        }}
      >
        {list.map((m) => (
          <MemberCard
            key={m.id}
            member={m}
            onClick={() => setSelected(m)}
          />
        ))}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ''}
      >
        {selected && (
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            <p style={{ margin: 0 }}>
              {selected.role} · {selected.clan_role}
            </p>
            {selected.bio && <p style={{ margin: 0 }}>{selected.bio}</p>}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {(selected.games || []).map((g) => (
                <span key={g} className={gameTagClass(g)}>
                  {g}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {(selected.fun_tags || []).map((t) => (
                <span key={t} className="lg-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

export function PageHeader({
  label,
  title,
  subtitle,
}: {
  label: string
  title: string
  subtitle?: string
}) {
  return (
    <header style={{ marginBottom: '1.5rem' }}>
      <div
        className="mono lg-muted"
        style={{ fontSize: '0.78rem', letterSpacing: '0.18em' }}
      >
        {label}
      </div>
      <h1 style={{ margin: '0.3rem 0 0', fontSize: '2rem' }}>{title}</h1>
      {subtitle && (
        <p className="lg-muted" style={{ marginTop: '0.4rem' }}>
          {subtitle}
        </p>
      )}
    </header>
  )
}
