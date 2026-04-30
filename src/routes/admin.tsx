import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import members from '@/data/members.json'
import events from '@/data/events.json'
import videos from '@/data/videos.json'
import settings from '@/data/settings.json'
import type { ClanEvent, ClanRole, Member, VideoItem } from '@/lib/types'
import { gameTagClass } from '@/lib/types'
import { Modal } from '@/components/Modal'
import { OnlineLamp } from '@/components/OnlineLamp'
import { useState, useEffect } from 'react'

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

/**
 * Admin-Dashboard.
 *
 * Wichtige Hinweise für die spätere Erweiterung:
 *
 *  - Auth: Diese Seite ist aktuell offen, aber nur per Direktlink erreichbar
 *    (kein Header-Eintrag). Sobald Netlify Identity / Auth0 / Clerk angebunden
 *    sind, sollte der Route-Loader hier den User prüfen und ggf. redirecten.
 *
 *  - Persistenz: Sämtliche Speicher-/Lösch-Aktionen sind aktuell nur im
 *    lokalen React-State. Beim Klick auf „Speichern" sollte später ein POST
 *    gegen eine Netlify Function (z.B. /.netlify/functions/admin-roster) gehen,
 *    die die Daten in einer Datenbank ablegt (Postgres via Netlify DB oder
 *    Netlify Blobs für Bilder).
 *
 *  - Bewerbungen / Event-Anmeldungen: Die Tabellen zeigen aktuell Dummy-Daten
 *    aus diesem Dashboard. Quelle wird später die Netlify-Forms-API
 *    (/.netlify/functions/admin-submissions) sein.
 *
 *  - Bild-Uploads: aktuell nur UI-Stub, der Upload muss später z.B. an
 *    Netlify Blobs / Cloudinary / S3 angebunden werden.
 */

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

      {/* Tabs */}
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

/* ============================================================
   Bewerbungen
   Quelle (später): /.netlify/functions/admin-submissions?form=bewerbung
   Aktuell: Dummy-Daten direkt in der Komponente.
   ============================================================ */

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

// Roster (ersetzt die vorhandene RosterTab-Funktion)
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

  // helper: file -> DataURL
  function toBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (e) => reject(e)
    })
  }

  // load members from function
  useEffect(() => {
    fetch('/.netlify/functions/get-members')
      .then((r) => r.json())
      .then((data) => setList(data))
      .catch((err) => console.error('get-members error', err))
  }, [])

  async function add(e: React.FormEvent) {
    e.preventDefault()

    let avatarUrl = '/placeholder.png'
    if (draft.avatarFile) {
      try {
        const dataUrl = await toBase64(draft.avatarFile)
        const base64 = (dataUrl as string).split(',')[1]
        const upRes = await fetch('/.netlify/functions/upload-avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: draft.avatarFile.name, fileBase64: base64 }),
        })
        const upJson = await upRes.json()
        if (upRes.ok && upJson.url) avatarUrl = upJson.url
      } catch (err) {
        alert('Fehler beim Upload: ' + (err as Error).message)
        return
      }
    }

    const memberPayload = {
      name: draft.name,
      role: draft.role,
      clanRole: draft.clanRole,
      games: (draft.games || '').split(',').map((s) => s.trim()).filter(Boolean),
      avatar: avatarUrl,
      bio: draft.bio,
      funTags: (draft.funTags || '').split(',').map((s) => s.trim()).filter(Boolean),
    }

    // get Netlify Identity token if logged in
    const token = window.netlifyIdentity && window.netlifyIdentity.currentUser()
      ? window.netlifyIdentity.currentUser().token.access_token
      : ''

    const saveRes = await fetch('/.netlify/functions/save-member', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(memberPayload),
    })

    if (!saveRes.ok) {
      const err = await saveRes.text()
      alert('Fehler beim Speichern: ' + err)
      return
    }

    const saved = await saveRes.json()
    setList((prev) => [saved, ...prev])
    setDraft({ name: '', role: '', clanRole: 'Recruit', games: '', bio: '', funTags: '', avatarFile: null })
  }

  async function remove(id: string) {
    // optional: implement function to delete from DB; currently local removal
    // TODO: call a delete-member function
    if (!confirm('Mitglied wirklich löschen?')) return
    setList((l) => l.filter((m) => m.id !== id))
  }

  return (
    <>
      <div className="lg-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ marginTop: 0 }}>Neues Mitglied hinzufügen</h2>
        <form onSubmit={add} style={{ display: 'grid', gap: '0.8rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <label><span className="lg-label">Name</span><input className="lg-input" required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
          <label><span className="lg-label">Rolle / Position</span><input className="lg-input" value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} /></label>
          <label>
            <span className="lg-label">Clan-Rang</span>
            <select className="lg-select" value={draft.clanRole} onChange={(e) => setDraft({ ...draft, clanRole: e.target.value as ClanRole })}>
              {(['Leader', 'Co-Leader', 'Officer', 'Member', 'Recruit'] as ClanRole[]).map((r) => <option key={r}>{r}</option>)}
            </select>
          </label>
          <label><span className="lg-label">Spiele (Komma-getrennt)</span><input className="lg-input" placeholder="PUBG, ARC Raiders" value={draft.games} onChange={(e) => setDraft({ ...draft, games: e.target.value })} /></label>
          <label style={{ gridColumn: '1 / -1' }}><span className="lg-label">Bio</span><textarea className="lg-textarea" value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} /></label>
          <label style={{ gridColumn: '1 / -1' }}><span className="lg-label">Fun-Tags (Komma-getrennt)</span><input className="lg-input" placeholder="Sniper, Strategist" value={draft.funTags} onChange={(e) => setDraft({ ...draft, funTags: e.target.value })} /></label>

          <label style={{ gridColumn: '1 / -1' }}>
            <span className="lg-label">Avatar (Upload)</span>
            <input className="lg-input" type="file" accept="image/*" onChange={(e) => setDraft({ ...draft, avatarFile: e.target.files?.[0] || null })} />
          </label>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="lg-btn lg-btn-primary" type="submit">Speichern</button>
          </div>
        </form>
      </div>

      <h2 style={{ marginTop: '2rem' }}>Aktuelle Mitglieder</h2>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {list.map((m) => (
          <div key={m.id} className="lg-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
              <img className="lg-avatar" src={m.avatar} alt={m.name} style={{ width: 50, height: 50 }} />
              <div>
                <div style={{ fontFamily: 'var(--font-headline)', textTransform: 'uppercase' }}>{m.name}</div>
                <div className="lg-muted" style={{ fontSize: '0.8rem' }}>{m.role} · {m.clanRole}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {(m.games || []).map((g) => <span key={g} className={gameTagClass(g)}>{g}</span>)}
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button className="lg-btn" style={{ flex: 1 }}>Bearbeiten</button>
              <button className="lg-btn lg-btn-danger" style={{ flex: 1 }} onClick={() => remove(m.id)}>Löschen</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ============================================================
   Events
   ============================================================ */

function EventsTab() {
  const [list, setList] = useState<ClanEvent[]>(events as ClanEvent[])
  const [draft, setDraft] = useState({ title: '', date: '', game: 'PUBG', description: '' })

  function add(e: React.FormEvent) {
    e.preventDefault()
    // TODO (later): POST /api/admin/events – inkl. optionalem Bild-Upload
    setList((l) => [
      { id: 'tmp-' + Date.now(), title: draft.title, date: draft.date, game: draft.game, description: draft.description, image: '/placeholder.png' },
      ...l,
    ])
    setDraft({ title: '', date: '', game: 'PUBG', description: '' })
  }

  function remove(id: string) {
    setList((l) => l.filter((e) => e.id !== id))
  }

  return (
    <>
      <div className="lg-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ marginTop: 0 }}>Neues Event</h2>
        <form onSubmit={add} style={{ display: 'grid', gap: '0.8rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <label><span className="lg-label">Titel</span><input className="lg-input" required value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
          <label><span className="lg-label">Datum</span><input className="lg-input" type="datetime-local" required value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} /></label>
          <label>
            <span className="lg-label">Spiel</span>
            <select className="lg-select" value={draft.game} onChange={(e) => setDraft({ ...draft, game: e.target.value })}>
              <option>PUBG</option>
              <option>ARC Raiders</option>
              <option>Mixed</option>
            </select>
          </label>
          <label style={{ gridColumn: '1 / -1' }}><span className="lg-label">Beschreibung</span><textarea className="lg-textarea" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></label>
          <label style={{ gridColumn: '1 / -1' }}>
            <span className="lg-label">Event-Bild (Upload – später Netlify Blobs / Cloudinary)</span>
            <input className="lg-input" type="file" />
          </label>
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="lg-btn lg-btn-primary" type="submit">Event speichern</button>
          </div>
        </form>
      </div>

      <h2 style={{ marginTop: '2rem' }}>Geplante Events</h2>
      <div style={{ display: 'grid', gap: '0.7rem' }}>
        {list.map((e) => (
          <div key={e.id} className="lg-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{e.title} <span className={gameTagClass(e.game)} style={{ marginLeft: 8 }}>{e.game}</span></div>
              <div className="mono lg-muted" style={{ fontSize: '0.78rem' }}>{e.date}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button className="lg-btn">Bearbeiten</button>
              <button className="lg-btn lg-btn-danger" onClick={() => remove(e.id)}>Löschen</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ============================================================
   Videos
   ============================================================ */

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

/* ============================================================
   Banner & News-Ticker
   ============================================================ */

function BannerTab() {
  const [bannerUrl, setBannerUrl] = useState(settings.bannerUrl)
  const [tickerText, setTickerText] = useState(settings.newsTickerText)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  function save(e: React.FormEvent) {
    e.preventDefault()
    // TODO (later): PUT /api/admin/settings → schreibt /data/settings.json
    // serverseitig (Netlify Function + persistenter Storage).
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

/* ============================================================
   Event-Anmeldungen
   ============================================================ */

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

/* ============================================================
   Helpers
   ============================================================ */

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
