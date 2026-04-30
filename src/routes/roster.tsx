import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase' // Importiert den Client
import type { Member } from '@/lib/types'
import { MemberCard } from '@/components/MemberCard'
import { Modal } from '@/components/Modal'
import { useState, useEffect } from 'react'
import { gameTagClass } from '@/lib/types'

export const Route = createFileRoute('/roster')({
  component: RosterPage,
})

function RosterPage() {
  const [selected, setSelected] = useState<Member | null>(null)
  const [list, setList] = useState<Member[]>([]) // State für die Live-Daten

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
        // Wir mappen die Datenbank-Felder (clan_role) auf dein Interface (clanRole)
        const formattedData = (data || []).map((m: any) => ({
          ...m,
          clanRole: m.clan_role, // Mappt Unterstrich auf CamelCase
          funTags: m.fun_tags    // Mappt Unterstrich auf CamelCase
        }))
        setList(formattedData)
      }
    }
    fetchMembers()
  }, [])

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
              <img className="lg-avatar" src={selected.avatar} alt={selected.name} style={{ width: 80, height: 80, objectFit: 'cover' }} />
              <div>
                <div style={{ fontFamily: 'var(--font-headline)', fontSize: '1.1rem' }}>{selected.role}</div>
                <div className="mono" style={{ color: 'var(--clr-accent-arc)' }}>{selected.clanRole}</div>
              </div>
            </div>
            <p style={{ margin: 0 }}>{selected.bio}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {(selected.games || []).map((g) => (
                <span key={g} className={gameTagClass(g)}>{g}</span>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {(selected.funTags || []).map((t) => (
                <span key={t} className="lg-tag">{t}</span>
              ))}
            </div>
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
