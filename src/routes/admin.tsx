import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Member, ClanRole, ClanEvent } from '@/lib/types'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

function AdminPage() {
  const [tab, setTab] = useState<'roster' | 'events' | 'news'>('roster')

  return (
    <div style={{ maxWidth: 1000, margin: '2rem auto', padding: '0 1.25rem' }}>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button className={`lg-btn ${tab === 'roster' ? 'lg-btn-primary' : ''}`} onClick={() => setTab('roster')}>Mitglieder</button>
        <button className={`lg-btn ${tab === 'events' ? 'lg-btn-primary' : ''}`} onClick={() => setTab('events')}>Events</button>
        <button className={`lg-btn ${tab === 'news' ? 'lg-btn-primary' : ''}`} onClick={() => setTab('news')}>News-Ticker</button>
      </div>

      {tab === 'roster' && <RosterTab />}
      {tab === 'events' && <EventsTab />}
      {tab === 'news' && <NewsTab />}
    </div>
  )
}

// --- NEWS TAB ---
function NewsTab() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('news').select('content').order('created_at', { ascending: false }).limit(1).single()
      .then(({ data }) => { if (data) setContent(data.content) })
  }, [])

  async function saveNews() {
    setLoading(true)
    const { data: existing } = await supabase.from('news').select('id').limit(1).single()
    const query = existing?.id 
      ? supabase.from('news').update({ content }).eq('id', existing.id)
      : supabase.from('news').insert([{ content }])
    
    const { error } = await query
    setLoading(false)
    if (error) alert(error.message)
    else alert('News-Ticker aktualisiert! ✨')
  }

  return (
    <div className="lg-panel" style={{ padding: '1.5rem' }}>
      <h2>News-Ticker bearbeiten</h2>
      <textarea className="lg-textarea" style={{ width: '100%', minHeight: '120px', marginBottom: '1rem' }} value={content} onChange={e => setContent(e.target.value)} />
      <button className="lg-btn lg-btn-primary" onClick={saveNews} disabled={loading}>{loading ? 'Speichert...' : 'News speichern'}</button>
    </div>
  )
}

// --- ROSTER TAB ---
function RosterTab() {
  const [list, setList] = useState<Member[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState({ name: '', role: '', clanRole: 'Recruit' as ClanRole, games: '', bio: '', funTags: '', avatarFile: null as File | null })

  useEffect(() => {
    supabase.from('members').select('*').order('created_at', { ascending: false }).then(({ data }) => setList(data || []))
  }, [])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    let avatarUrl = list.find(m => m.id === editingId)?.avatar || '/placeholder.png'
    if (draft.avatarFile) {
      const fileName = `img-${Date.now()}.jpg`
      await supabase.storage.from('member-images').upload(fileName, draft.avatarFile)
      avatarUrl = supabase.storage.from('member-images').getPublicUrl(fileName).data.publicUrl
    }
    const payload = { 
        name: draft.name, role: draft.role, clan_role: draft.clanRole, avatar: avatarUrl, bio: draft.bio,
        games: draft.games.split(',').map(s => s.trim()).filter(Boolean),
        fun_tags: draft.funTags.split(',').map(s => s.trim()).filter(Boolean)
    }
    const query = editingId ? supabase.from('members').update(payload).eq('id', editingId) : supabase.from('members').insert([payload])
    const { error } = await query
    if (error) alert(error.message)
    else window.location.reload()
  }

  return (
    <div className="lg-panel" style={{ padding: '1.5rem' }}>
        <h2>Mitglieder verwalten</h2>
        <form onSubmit={add} style={{ display: 'grid', gap: '0.8rem' }}>
            <input className="lg-input" placeholder="Name" required value={draft.name} onChange={e => setDraft({...draft, name: e.target.value})} />
            <button className="lg-btn lg-btn-primary" type="submit">Speichern</button>
        </form>
        <hr style={{ margin: '2rem 0' }} />
        {list.map(m => <div key={m.id}>{m.name} <button className="lg-btn lg-btn-danger" onClick={() => supabase.from('members').delete().eq('id', m.id).then(() => window.location.reload())}>Löschen</button></div>)}
    </div>
  )
}

// --- EVENTS TAB ---
function EventsTab() {
  const [list, setList] = useState<ClanEvent[]>([])
  const [draft, setDraft] = useState({ title: '', date: '', game: 'PUBG', description: '' })

  useEffect(() => {
    supabase.from('events').select('*').order('date', { ascending: true }).then(({ data }) => setList(data || []))
  }, [])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.from('events').insert([draft])
    if (error) alert(error.message)
    else window.location.reload()
  }

  return (
    <div className="lg-panel" style={{ padding: '1.5rem' }}>
        <h2>Events verwalten</h2>
        <form onSubmit={add} style={{ display: 'grid', gap: '0.8rem' }}>
            <input className="lg-input" placeholder="Titel" required value={draft.title} onChange={e => setDraft({...draft, title: e.target.value})} />
            <button className="lg-btn lg-btn-primary" type="submit">Hinzufügen</button>
        </form>
        <hr style={{ margin: '2rem 0' }} />
        {list.map(ev => <div key={ev.id}>{ev.title}</div>)}
    </div>
  )
}
