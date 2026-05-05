import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import members from '@/data/members.json'
import events from '@/data/events.json'
import videos from '@/data/videos.json'
import settings from '@/data/settings.json'
import type { ClanEvent, ClanRole, Member, VideoItem } from '@/lib/types'
import { gameTagClass } from '@/lib/types'
import { Modal } from '@/components/Modal'
import { OnlineLamp } from '@/components/OnlineLamp'
import { supabase } from '../lib/supabase';
import type React from 'react'


// !!! WICHTIG: Du musst deinen supabase client hier importieren !!!
// import { supabase } from '@/lib/supabase' 

// Simple client-side guard (lightweight, not production-secure)
const ADMIN_PASSWORD = 'Snickers2026!' // ändere hier dein Passwort

function AdminWrapper(props: any) {
  const [authorized, setAuthorized] = useState(false)
  const [pw, setPw] = useState('')

  if (!authorized) {
    return (
      <div style={{ maxWidth: 480, margin: '4rem auto', padding: '1rem' }}>
        <h2>Admin Login</h2>
        <p style={{ color: 'var(--clr-text-muted)' }}>Dieser Bereich ist nur für Admins. Bitte Passwort eingeben.</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Admin-Passwort"
          style={{ width: '100%', padding: '.6rem', marginBottom: '.6rem', borderRadius: 6, border: '1px solid var(--clr-border)', background: 'var(--clr-bg)', color: 'var(--clr-text)' }}
        />
        <div style={{ display: 'flex', gap: '.6rem' }}>
          <button className="lg-btn" onClick={() => { if (pw === ADMIN_PASSWORD) setAuthorized(true); else alert('Falsches Passwort'); }}>
            Login
          </button>
          <button className="btn-sm" onClick={() => setPw('')}>Zurücksetzen</button>
        </div>
      </div>
    )
  }

  return <AdminPage {...props} />
}

export const Route = createFileRoute('/admin')({
  component: AdminWrapper,
})

type Tab =
  | 'bewerbungen'
  | 'roster'
  | 'events'
  | 'videos'
  | 'banner'
  | 'event-anmeldungen'

const TABS: { id: Tab; label: string }[] = [
  { id: 'bewerbungen', label: 'Bewerbungen' },
  { id: 'roster', label: 'Clan Roster' },
  { id: 'events', label: 'Events' },
  { id: 'videos', label: 'Videos' },
  { id: 'banner', label: 'Banner & News-Ticker' },
  { id: 'event-anmeldungen', label: 'Event-Anmeldungen' },
]

function AdminPage() {
  const [tab, setTab] = useState<Tab>('bewerbungen')

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="mono lg-muted" style={{ fontSize: '0.78rem', letterSpacing: '0.18em' }}>
            // ADMIN AREA
          </div>
          <h1 style={{ margin: '0.3rem 0 0', fontSize: '2rem' }}>
            Dashboard <span style={{ color: 'var(--clr-accent-arc)' }}>Leider Geil</span>
          </h1>
          <p className="lg-muted" style={{ marginTop: '0.4rem' }}>
            Interner Bereich – aktuell ohne Auth. Daten werden noch nicht persistiert.
          </p>
        </div>
        <div className="lg-panel" style={{ padding: '0.6rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <OnlineLamp /> <span className="mono" style={{ fontSize: '0.8rem' }}>session: dev-mode</span>
        </div>
      </div>

      <nav
        style={{
          display: 'flex',
          gap: '0.4rem',
          marginTop: '1.5rem',
          flexWrap: 'wrap',
          borderBottom: '1px solid var(--clr-border)',
          paddingBottom: '0.6rem',
        }}
      >
        {TABS.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="lg-btn"
              style={{
                padding: '0.5rem 0.9rem',
                fontSize: '0.78rem',
                borderColor: active ? 'var(--clr-accent-arc)' : 'var(--clr-border)',
                color: active ? 'var(--clr-accent-arc)' : 'var(--clr-text)',
                boxShadow: active ? '0 0 14px rgba(15, 242, 169, 0.25)' : 'none',
              }}
            >
              {t.label}
            </button>
          )
        })}
      </nav>

      <div style={{ marginTop: '1.5rem' }}>
        {tab === 'bewerbungen' && <BewerbungenTab />}
        {tab === 'roster' && <RosterTab />}
        {tab === 'events' && <EventsTab />}
        {tab === 'videos' && <VideosTab />}
        {tab === 'banner' && <BannerTab />}
        {tab === 'event-anmeldungen' && <EventAnmeldungenTab />}
      </div>
    </div>
  )
}

/* ==================================================================
   Bewerbungen
   ================================================================== */

interface Application {
  id: string
  name: string
  alter: number
  spiel: string
  rolle: string
  text: string
  date: string
}

const dummyApplications: Application[] = [
  { id: 'a1', name: 'NeonPanda', alter: 22, spiel: 'PUBG', rolle: 'Member', text: 'Ich spiele gerne im Squad und bringe Erfahrung aus Liga-Matches mit.', date: '2026-04-21' },
  { id: 'a2', name: 'CtrlAltDel', alter: 28, spiel: 'ARC Raiders', rolle: 'Officer', text: 'Suche festen Clan, in dem auch Strategie zählt.', date: '2026-04-19' },
  { id: 'a3', name: 'BananaCrash', alter: 19, spiel: 'PUBG', rolle: 'Recruit', text: 'Erstkontakt – Spaß steht für mich klar im Vordergrund.', date: '2026-04-17' },
]

function BewerbungenTab() {
  const [open, setOpen] = useState<Application | null>(null)
  const total = dummyApplications.length
  const pubg = dummyApplications.filter((a) => a.spiel === 'PUBG').length
  const arc = dummyApplications.filter((a) => a.spiel === 'ARC Raiders').length

  return (
    <>
      <Stats stats={[
        { label: 'Bewerbungen', value: total },
        { label: 'PUBG', value: pubg, accent: 'var(--clr-accent-pubg)' },
        { label: 'ARC Raiders', value: arc, accent: 'var(--clr-accent-arc)' },
      ]} />

      <div className="lg-panel" style={{ padding: '0', overflowX: 'auto' }}>
        <table className="lg-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Alter</th>
              <th>Spiel</th>
              <th>Rolle</th>
              <th>Kurztext</th>
              <th>Datum</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {dummyApplications.map((a) => (
              <tr key={a.id}>
                <td><strong>{a.name}</strong></td>
                <td>{a.alter}</td>
                <td><span className={gameTagClass(a.spiel)}>{a.spiel}</span></td>
                <td>{a.rolle}</td>
                <td style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.text}</td>
                <td className="mono lg-muted" style={{ fontSize: '0.8rem' }}>{a.date}</td>
                <td>
                  <button className="lg-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => setOpen(a)}>
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.name ?? ''}>
        {open && (
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            <KV label="Alter" value={open.alter} />
            <KV label="Spiel" value={open.spiel} />
            <KV label="Wunschrolle" value={open.rolle} />
            <KV label="Datum" value={open.date} />
            <div>
              <span className="lg-label">Motivation</span>
              <p style={{ margin: 0 }}>{open.text}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

/* ==================================================================
   Roster
   ================================================================== */

function RosterTab() {
  const [list, setList] = useState<Member[]>([])
  const [draft, setDraft] = useState({
    name: '',
    role: '',
    clanRole: 'Recruit' as ClanRole,
    games: '',
    bio: '',
    funTags: '',
    avatarFile: null as File | null,
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    const loadMembers = async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Fehler beim Laden:', error.message)
      } else {
        setList((data || []) as Member[])
      }
    }
    loadMembers()
  }, [])

  async function saveMember(e: React.FormEvent) {
    e.preventDefault()
    let avatarUrl = '/placeholder.png'

    if (draft.avatarFile) {
      try {
        const file = draft.avatarFile
        const fileName = `img-${Date.now()}.jpg`
        const { error: upError } = await supabase.storage
          .from('member-images')
          .upload(fileName, file)

        if (upError) throw upError
        const { data: urlData } = supabase.storage
          .from('member-images')
          .getPublicUrl(fileName)
        avatarUrl = urlData.publicUrl
      } catch (err) {
        alert('Upload-Fehler: ' + (err as Error).message)
        return
      }
    }

    const payload: any = {
      name: draft.name,
      role: draft.role,
      clan_role: draft.clanRole,
      bio: draft.bio,
      games: draft.games
        ? draft.games.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      fun_tags: draft.funTags
        ? draft.funTags.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    }

    if (draft.avatarFile) {
      payload.avatar = avatarUrl
    }

    try {
      if (editingId) {
        // UPDATE
        const { data, error } = await supabase
          .from('members')
          .update(payload)
          .eq('id', editingId)
          .select()

        if (error) throw error

        if (data && data[0]) {
          setList((l) =>
            l.map((m) => (m.id === editingId ? (data[0] as Member) : m)),
          )
        }
        alert('Mitglied aktualisiert.')
      } else {
        // INSERT
        const { data: newData, error: saveError } = await supabase
          .from('members')
          .insert([
            {
              ...payload,
              avatar: payload.avatar ?? avatarUrl,
            },
          ])
          .select()

        if (saveError) throw saveError
        if (newData && newData[0]) {
          setList((l) => [newData[0] as Member, ...l])
        }
        alert('Erfolg! Mitglied gespeichert.')
      }

      setDraft({
        name: '',
        role: '',
        clanRole: 'Recruit' as ClanRole,
        games: '',
        bio: '',
        funTags: '',
        avatarFile: null,
      })
      setEditingId(null)
    } catch (err) {
      alert('Speicher-Fehler: ' + (err as Error).message)
    }
  }

  async function remove(id: string) {
    if (!confirm('Mitglied wirklich löschen?')) return
    const { error } = await supabase.from('members').delete().eq('id', id)
    if (error) alert('Fehler: ' + error.message)
    else setList((l) => l.filter((m) => m.id !== id))
  }

  return (
    <>
      <div className="lg-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ marginTop: 0 }}>
          {editingId ? 'Mitglied bearbeiten' : 'Neues Mitglied hinzufügen'}
        </h2>
        <form
          onSubmit={saveMember}
          style={{
            display: 'grid',
            gap: '0.8rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          }}
        >
          <label>
            <span className="lg-label">Name</span>
            <input
              className="lg-input"
              required
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </label>
          <label>
            <span className="lg-label">Rolle / Position</span>
            <input
              className="lg-input"
              value={draft.role}
              onChange={(e) => setDraft({ ...draft, role: e.target.value })}
            />
          </label>
          <label>
            <span className="lg-label">Clan-Rang</span>
            <select
              className="lg-select"
              value={draft.clanRole}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  clanRole: e.target.value as ClanRole,
                })
              }
            >
              {(
                ['Leader', 'Co-Leader', 'Officer', 'Member', 'Recruit'] as ClanRole[]
              ).map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="lg-label">Spiele (Komma-getrennt)</span>
            <input
              className="lg-input"
              placeholder="PUBG, ARC Raiders"
              value={draft.games}
              onChange={(e) => setDraft({ ...draft, games: e.target.value })}
            />
          </label>
          <label style={{ gridColumn: '1 / -1' }}>
            <span className="lg-label">Bio</span>
            <textarea
              className="lg-textarea"
              value={draft.bio}
              onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
            />
          </label>
          <label style={{ gridColumn: '1 / -1' }}>
            <span className="lg-label">Fun-Tags (Komma-getrennt)</span>
            <input
              className="lg-input"
              placeholder="Sniper, Strategist"
              value={draft.funTags}
              onChange={(e) => setDraft({ ...draft, funTags: e.target.value })}
            />
          </label>
          <label style={{ gridColumn: '1 / -1' }}>
            <span className="lg-label">Avatar (Upload)</span>
            <input
              className="lg-input"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setDraft({
                  ...draft,
                  avatarFile: e.target.files?.[0] || null,
                })
              }
            />
          </label>
          <div
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '0.5rem',
            }}
          >
            {editingId && (
              <button
                type="button"
                className="lg-btn"
                onClick={() => {
                  setEditingId(null)
                  setDraft({
                    name: '',
                    role: '',
                    clanRole: 'Recruit' as ClanRole,
                    games: '',
                    bio: '',
                    funTags: '',
                    avatarFile: null,
                  })
                }}
              >
                Abbrechen
              </button>
            )}
            <button className="lg-btn lg-btn-primary" type="submit">
              {editingId ? 'Aktualisieren' : 'Speichern'}
            </button>
          </div>
        </form>
      </div>

      <h2 style={{ marginTop: '2rem' }}>Aktuelle Mitglieder</h2>
      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        }}
      >
        {list.map((m) => (
          <div
            key={m.id}
            className="lg-panel"
            style={{
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
            }}
          >
            <div
              style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}
            >
              <img
                className="lg-avatar"
                src={m.avatar || '/placeholder.png'}
                alt={m.name}
                style={{ width: 50, height: 50, objectFit: 'cover' }}
              />
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-headline)',
                    textTransform: 'uppercase',
                  }}
                >
                  {m.name}
                </div>
                <div
                  className="lg-muted"
                  style={{ fontSize: '0.8rem' }}
                >
                  {m.role} · {m.clan_role}
                </div>
              </div>
            </div>
            <div
              style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}
            >
              {(m.games || []).map((g) => (
                <span key={g} className="lg-tag">
                  {g}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                className="lg-btn"
                style={{ flex: 1 }}
                onClick={() => {
                  setEditingId(m.id)
                  setDraft({
                    name: m.name,
                    role: m.role || '',
                    clanRole: m.clan_role as ClanRole,
                    games: (m.games || []).join(', '),
                    bio: m.bio || '',
                    funTags: (m.fun_tags || []).join(', '),
                    avatarFile: null,
                  })
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                Bearbeiten
              </button>
              <button
                className="lg-btn lg-btn-danger"
                style={{ flex: 1 }}
                onClick={() => remove(m.id)}
              >
                Löschen
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}


/* ==================================================================
   Events, Videos, Banner, EventAnmeldungen... (Rest bleibt identisch)
   ================================================================== */
async function saveEvent(options: {
  supabase: typeof supabase
  draft: {
    title: string
    date: string
    game: string
    description: string
  }
  editingId?: string | null
  file: File | null
}) {
  const { supabase, draft, editingId, file } = options

  // Datum robust umwandeln (für timestamptz oder text)
  const dateValue = (() => {
    const d = new Date(draft.date)
    return Number.isNaN(d.getTime()) ? draft.date : d.toISOString()
  })()

  if (editingId) {
    // UPDATE
    const payload: any = {
      title: draft.title,
      date: dateValue,
      game: draft.game,
      description: draft.description,
    }

    const { data: updated, error } = await supabase
      .from('events')
      .update(payload)
      .eq('id', editingId)
      .select('*')
      .maybeSingle()

    if (error) throw error
    if (!updated) throw new Error('Update: keine Zeile gefunden (editingId passt nicht?)')

    // Optional Bild
    if (file) {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const filePath = `events/${editingId}.${ext}`

      const { error: uploadError } = await supabase
        .storage
        .from('event-images')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw new Error('Bild-Upload fehlgeschlagen: ' + uploadError.message)

      const { data: publicUrlData } = supabase
        .storage
        .from('event-images')
        .getPublicUrl(filePath)

      const { data: updated2, error: updImgError } = await supabase
        .from('events')
        .update({ image: publicUrlData.publicUrl })
        .eq('id', editingId)
        .select('*')
        .maybeSingle()

      if (updImgError) throw updImgError
      return updated2
    }

    return updated
  } else {
    // INSERT
    const basePayload: any = {
      title: draft.title,
      date: dateValue,
      game: draft.game,
      description: draft.description,
      image: '/placeholder.png',
    }

    const { data: inserted, error } = await supabase
      .from('events')
      .insert(basePayload)
      .select('*')
      .maybeSingle()

    if (error) throw error
    if (!inserted) throw new Error('Insert: keine Zeile zurückbekommen.')

    if (file) {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const filePath = `events/${inserted.id}.${ext}`

      const { error: uploadError } = await supabase
        .storage
        .from('event-images')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw new Error('Bild-Upload fehlgeschlagen: ' + uploadError.message)

      const { data: publicUrlData } = supabase
        .storage
        .from('event-images')
        .getPublicUrl(filePath)

      const { data: updatedRow, error: updImgError } = await supabase
        .from('events')
        .update({ image: publicUrlData.publicUrl })
        .eq('id', inserted.id)
        .select('*')
        .maybeSingle()

      if (updImgError) throw updImgError
      return updatedRow
    }

    return inserted
  }
}
function EventsTab() {
  const [list, setList] = useState<ClanEvent[]>([])
  const [draft, setDraft] = useState<{
    title: string
    date: string
    game: string
    description: string
  }>({
    title: '',
    date: '',
    game: 'PUBG',
    description: '',
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [eventImageFile, setEventImageFile] = useState<File | null>(null)

  // Events von Supabase laden
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })

      if (error) {
        console.error('Fehler beim Laden der Events:', error.message)
        setList([])
      } else {
        setList((data || []) as ClanEvent[])
      }
      setLoading(false)
    }
    load()
  }, [])

  function resetForm() {
    setDraft({
      title: '',
      date: '',
      game: 'PUBG',
      description: '',
    })
    setEditingId(null)
    setEventImageFile(null)
  }

  // Bild zu Supabase Storage hochladen und Public URL zurückgeben
      async function uploadEventImage(file: File, eventId: string) {
    const ext = file.name.split('.').pop() || 'jpg'
    const filePath = `events/${eventId}.${ext}`

    const { error: uploadError } = await supabase
      .storage
      .from('event-images')
      .upload(filePath, file, {
        upsert: true,
      })

    if (uploadError) {
      throw new Error('Bild-Upload fehlgeschlagen: ' + uploadError.message)
    }

    const { data } = supabase
      .storage
      .from('event-images')
      .getPublicUrl(filePath)

    return data.publicUrl as string
  }

    async function addOrUpdate(e: React.FormEvent) {
  e.preventDefault()

  try {
    const saved = await saveEvent({
      supabase,
      draft,
      editingId,
      file: eventImageFile,
    })

    if (saved) {
      setList((prev) => {
        // Wenn editingId existiert: Liste updaten
        if (editingId) {
          return prev.map((ev) => (ev.id === saved.id ? (saved as ClanEvent) : ev))
        }
        // Sonst: Neues Event vorne einfügen
        return [saved as ClanEvent, ...prev]
      })
    }

    alert(editingId ? 'Event aktualisiert.' : 'Event gespeichert.')
    resetForm()
  } catch (err) {
    console.error('Fehler beim Speichern:', err)
    alert('Speicherfehler: ' + (err as Error).message)
  }
}

 return (
  <>
    <div className="lg-panel" style={{ padding: '1.5rem' }}>
      <div style={{ color: 'red', fontWeight: 'bold' }}>
        DEBUG: EventsTab LIVE
      </div>
      <h2 style={{ marginTop: 0 }}>
        {editingId ? 'Event bearbeiten' : 'Neues Event'}
      </h2>
      <form
        onSubmit={addOrUpdate}
        style={{
          display: 'grid',
          gap: '0.8rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        }}
      >
        {/* ... Rest unverändert ... */}
          <label>
            <span className="lg-label">Titel</span>
            <input
              className="lg-input"
              required
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </label>
          <label>
            <span className="lg-label">Datum</span>
            <input
              className="lg-input"
              type="datetime-local"
              required
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            />
          </label>
          <label>
            <span className="lg-label">Spiel</span>
            <select
              className="lg-select"
              value={draft.game}
              onChange={(e) => setDraft({ ...draft, game: e.target.value })}
            >
              <option>PUBG</option>
              <option>ARC Raiders</option>
              <option>Mixed</option>
            </select>
          </label>
          <label style={{ gridColumn: '1 / -1' }}>
            <span className="lg-label">Beschreibung</span>
            <textarea
              className="lg-textarea"
              value={draft.description}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
            />
          </label>
          <label style={{ gridColumn: '1 / -1' }}>
            <span className="lg-label">Event-Bild (Upload zu Supabase Storage)</span>
            <input
              className="lg-input"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                setEventImageFile(file)
              }}
            />
          </label>
          <div
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '0.5rem',
            }}
          >
            {editingId && (
              <button type="button" className="lg-btn" onClick={resetForm}>
                Abbrechen
              </button>
            )}
            <button className="lg-btn lg-btn-primary" type="submit">
              {editingId ? 'Aktualisieren' : 'Speichern'}
            </button>
          </div>
        </form>
      </div>

      <h2 style={{ marginTop: '2rem' }}>Geplante Events</h2>
      {loading && (
        <div className="lg-muted mono" style={{ fontSize: '0.8rem' }}>
          Lade Events…
        </div>
      )}
      {!loading && (
        <div style={{ display: 'grid', gap: '0.7rem' }}>
          {list.map((e) => (
            <div
              key={e.id}
              className="lg-panel"
              style={{
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.6rem',
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>
                  {e.title}{' '}
                  <span className={gameTagClass(e.game)} style={{ marginLeft: 8 }}>
                    {e.game}
                  </span>
                </div>
                <div className="mono lg-muted" style={{ fontSize: '0.78rem' }}>
                  {e.date}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button className="lg-btn" onClick={() => startEdit(e)}>
                  Bearbeiten
                </button>
                <button
                  className="lg-btn lg-btn-danger"
                  onClick={() => remove(e.id as string)}
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function VideosTab() {
  const [list, setList] = useState<VideoItem[]>(videos as VideoItem[])
  const [draft, setDraft] = useState({ title: '', url: '' })

  function thumbFromYoutube(url: string): string {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
    return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : '/placeholder.png'
  }

  function add(e: React.FormEvent) {
    e.preventDefault()
    setList((l) => [
      {
        id: 'tmp-' + Date.now(),
        title: draft.title,
        description: '',
        url: draft.url,
        thumbnail: thumbFromYoutube(draft.url),
        platform: draft.url.includes('twitch') ? 'Twitch' : 'YouTube',
      },
      ...l,
    ])
    setDraft({ title: '', url: '' })
  }

  function remove(id: string) {
    setList((l) => l.filter((v) => v.id !== id))
  }

  return (
    <>
      <div className="lg-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ marginTop: 0 }}>Neues Video</h2>
        <form onSubmit={add} style={{ display: 'grid', gap: '0.8rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <label><span className="lg-label">Titel</span><input className="lg-input" required value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
          <label><span className="lg-label">YouTube-/Twitch-URL</span><input className="lg-input" required value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} /></label>
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="lg-btn lg-btn-primary" type="submit">Speichern</button>
          </div>
        </form>
      </div>

      <h2 style={{ marginTop: '2rem' }}>Video-Liste</h2>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {list.map((v) => (
          <div key={v.id} className="lg-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <img src={v.thumbnail} alt={v.title} style={{ aspectRatio: '16/9', objectFit: 'cover' }} />
            <div style={{ padding: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{v.title}</div>
              <div className="mono lg-muted" style={{ fontSize: '0.75rem' }}>{v.platform}</div>
              <button className="lg-btn lg-btn-danger" style={{ marginTop: 'auto' }} onClick={() => remove(v.id)}>Löschen</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function BannerTab() {
  const [bannerUrl, setBannerUrl] = useState(settings.bannerUrl)
  const [tickerText, setTickerText] = useState(settings.newsTickerText)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  function save(e: React.FormEvent) {
    e.preventDefault()
    setSavedAt(new Date().toLocaleTimeString('de-DE'))
  }

  return (
    <>
      <div className="lg-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ marginTop: 0 }}>Banner</h2>
        <p className="lg-muted" style={{ marginTop: 0 }}>Empfohlen: 1920×600 px.</p>
        <div style={{ aspectRatio: '24 / 7', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--clr-border)', marginBottom: '1rem' }}>
          <img src={bannerUrl} alt="Banner-Vorschau" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <form onSubmit={save} style={{ display: 'grid', gap: '0.8rem' }}>
          <label><span className="lg-label">Banner-URL</span><input className="lg-input" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} /></label>
          <label><span className="lg-label">… oder Datei hochladen (später Netlify Blobs)</span><input className="lg-input" type="file" /></label>
          <hr className="lg-divider" />
          <h2 style={{ margin: 0 }}>News-Ticker</h2>
          <label><span className="lg-label">Standard-Lauftext</span><textarea className="lg-textarea" value={tickerText} onChange={(e) => setTickerText(e.target.value)} /></label>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {savedAt && <span className="mono" style={{ color: 'var(--clr-accent-arc)' }}>✓ Gespeichert um {savedAt}</span>}
            <button className="lg-btn lg-btn-primary" type="submit" style={{ marginLeft: 'auto' }}>Speichern</button>
          </div>
        </form>
      </div>
    </>
  )
}

interface Signup {
  id: string
  name: string
  spiel: string
  clan: string
  spieler: number
  bemerkungen: string
  date: string
}

const dummySignups: Signup[] = [
  { id: 's1', name: 'NeonByte', spiel: 'PUBG', clan: 'Leider Geil', spieler: 4, bemerkungen: 'Voller Squad, alle ready.', date: '2026-04-22' },
  { id: 's2', name: 'StaticHaze', spiel: 'ARC Raiders', clan: 'Solo', spieler: 1, bemerkungen: 'Würde gerne mit Random-Squad spielen.', date: '2026-04-20' },
  { id: 's3', name: 'CtrlAltDel', spiel: 'PUBG', clan: 'Der astreime', spieler: 4, bemerkungen: 'Allianz-Match-Anfrage.', date: '2026-04-18' },
]

function EventAnmeldungenTab() {
  const [list, setList] = useState<Signup[]>(dummySignups)
  const [open, setOpen] = useState<Signup | null>(null)

  const total = list.length
  const pubg = list.filter((s) => s.spiel === 'PUBG').length
  const arc = list.filter((s) => s.spiel === 'ARC Raiders').length

  return (
    <>
      <Stats stats={[
        { label: 'Anmeldungen', value: total },
        { label: 'PUBG', value: pubg, accent: 'var(--clr-accent-pubg)' },
        { label: 'ARC Raiders', value: arc, accent: 'var(--clr-accent-arc)' },
      ]} />

      <div className="lg-panel" style={{ overflowX: 'auto' }}>
        <table className="lg-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Spiel</th>
              <th>Clan</th>
              <th>Spieler</th>
              <th>Bemerkungen</th>
              <th>Datum</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id}>
                <td><strong>{s.name}</strong></td>
                <td><span className={gameTagClass(s.spiel)}>{s.spiel}</span></td>
                <td>{s.clan || '—'}</td>
                <td>{s.spieler}</td>
                <td style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.bemerkungen}</td>
                <td className="mono lg-muted" style={{ fontSize: '0.8rem' }}>{s.date}</td>
                <td style={{ display: 'flex', gap: '0.3rem' }}>
                  <button className="lg-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => setOpen(s)}>Details</button>
                  <button className="lg-btn lg-btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => setList((l) => l.filter((x) => x.id !== s.id))}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.name ?? ''}>
        {open && (
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            <KV label="Spiel" value={open.spiel} />
            <KV label="Clan" value={open.clan || '—'} />
            <KV label="Anzahl Spieler" value={open.spieler} />
            <KV label="Datum" value={open.date} />
            <div>
              <span className="lg-label">Bemerkungen</span>
              <p style={{ margin: 0 }}>{open.bemerkungen}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

function Stats({ stats }: { stats: { label: string; value: number; accent?: string }[] }) {
  return (
    <div style={{ display: 'grid', gap: '0.8rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: '1.2rem' }}>
      {stats.map((s) => (
        <div key={s.label} className="lg-panel" style={{ padding: '1rem' }}>
          <div className="mono lg-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>{s.label.toUpperCase()}</div>
          <div style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', color: s.accent ?? 'var(--clr-text)' }}>{s.value}</div>
        </div>
      ))}
    </div>
  )
}

function KV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--clr-border)', padding: '0.4rem 0' }}>
      <span className="lg-muted mono" style={{ fontSize: '0.8rem' }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  )
}

