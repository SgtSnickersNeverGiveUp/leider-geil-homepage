function AdminPage() {
  const [tab, setTab] = useState<'roster' | 'events' | 'news'>('roster')

  return (
    <div style={{ maxWidth: 1000, margin: '2rem auto', padding: '0 1.25rem' }}>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
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

function NewsTab() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  // Aktuelle News beim Laden abrufen
  useEffect(() => {
    supabase.from('news').select('content').order('created_at', { ascending: false }).limit(1).single()
      .then(({ data }) => { 
        if (data) setContent(data.content) 
      })
  }, [])

  async function saveNews() {
    setLoading(true)
    
    // Wir holen zuerst den neuesten Eintrag, um zu sehen, ob wir updaten oder neu anlegen müssen
    const { data: existing } = await supabase.from('news').select('id').limit(1).single()

    let result;
    if (existing?.id) {
      // Update den bestehenden Eintrag
      result = await supabase.from('news').update({ content }).eq('id', existing.id)
    } else {
      // Erstelle den allerersten Eintrag
      result = await supabase.from('news').insert([{ content }])
    }

    setLoading(false)
    if (result.error) {
      alert('Fehler: ' + result.error.message)
    } else {
      alert('News-Ticker aktualisiert! ✨')
    }
  }

  return (
    <div className="lg-panel" style={{ padding: '1.5rem' }}>
      <h2>News-Ticker bearbeiten</h2>
      <p style={{ fontSize: '0.9rem', color: 'var(--clr-text-muted)', marginBottom: '1rem' }}>
        Der Text, den du hier eingibst, erscheint in der Laufschrift auf der Startseite.
      </p>
      <textarea 
        className="lg-textarea" 
        style={{ width: '100%', minHeight: '120px', marginBottom: '1rem', fontSize: '1rem' }}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Schreibe hier deine News..."
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="lg-btn lg-btn-primary" onClick={saveNews} disabled={loading}>
          {loading ? 'Speichert...' : 'News speichern'}
        </button>
      </div>
    </div>
  )
}



function RosterTab() {
  const [list, setList] = useState<Member[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState({
    name: '', role: '', clanRole: 'Recruit' as ClanRole,
    games: '', bio: '', funTags: '', avatarFile: null as File | null
  })

  useEffect(() => {
    supabase.from('members').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setList(data || []))
  }, [])

  function startEdit(m: Member) {
    setEditingId(m.id)
    setDraft({
      name: m.name,
      role: m.role || '',
      clanRole: m.clan_role as ClanRole,
      games: (m.games || []).join(', '),
      bio: m.bio || '',
      funTags: (m.fun_tags || []).join(', '),
      avatarFile: null
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function add(e: React.FormEvent) {
    e.preventDefault()
    let avatarUrl = list.find(m => m.id === editingId)?.avatar || '/placeholder.png'

    if (draft.avatarFile) {
      const fileName = `img-${Date.now()}.jpg`
      const { data: upData } = await supabase.storage.from('member-images').upload(fileName, draft.avatarFile)
      if (upData) {
        avatarUrl = supabase.storage.from('member-images').getPublicUrl(fileName).data.publicUrl
      }
    }

    const payload = {
      name: draft.name,
      role: draft.role,
      clan_role: draft.clanRole,
      avatar: avatarUrl,
      bio: draft.bio,
      games: draft.games.split(',').map(s => s.trim()).filter(Boolean),
      fun_tags: draft.funTags.split(',').map(s => s.trim()).filter(Boolean)
    }

    const query = editingId 
      ? supabase.from('members').update(payload).eq('id', editingId) 
      : supabase.from('members').insert([payload])

    const { error } = await query
    if (error) alert(error.message)
    else window.location.reload()
  }

  return (
    <>
      <div className="lg-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h2>{editingId ? 'Mitglied bearbeiten' : 'Neues Mitglied'}</h2>
        <form onSubmit={add} style={{ display: 'grid', gap: '0.8rem' }}>
          <input className="lg-input" placeholder="Name" required value={draft.name} onChange={e => setDraft({...draft, name: e.target.value})} />
          <input className="lg-input" placeholder="Rolle" value={draft.role} onChange={e => setDraft({...draft, role: e.target.value})} />
          <select className="lg-select" value={draft.clanRole} onChange={e => setDraft({...draft, clanRole: e.target.value as ClanRole})}>
             <option value="Leader">Leader</option><option value="Co-Leader">Co-Leader</option><option value="Officer">Officer</option><option value="Member">Member</option><option value="Recruit">Recruit</option>
          </select>
          <textarea className="lg-textarea" placeholder="Bio" value={draft.bio} onChange={e => setDraft({...draft, bio: e.target.value})} />
          <input className="lg-input" type="file" onChange={e => setDraft({...draft, avatarFile: e.target.files?.[0] || null})} />
          <button className="lg-btn lg-btn-primary" type="submit">{editingId ? 'Speichern' : 'Hinzufügen'}</button>
          {editingId && <button className="lg-btn" type="button" onClick={() => window.location.reload()}>Abbrechen</button>}
        </form>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {list.map(m => (
          <div key={m.id} className="lg-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><strong>{m.name}</strong> ({m.clan_role})</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="lg-btn" onClick={() => startEdit(m)}>Bearbeiten</button>
              <button className="lg-btn lg-btn-danger" onClick={async () => {
                if(confirm('Löschen?')) {
                  await supabase.from('members').delete().eq('id', m.id);
                  window.location.reload();
                }
              }}>Löschen</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function EventsTab() {
  const [list, setList] = useState<ClanEvent[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState({ title: '', date: '', game: 'PUBG', description: '' })

  useEffect(() => {
    supabase.from('events').select('*').order('date', { ascending: true })
      .then(({ data }) => setList(data || []))
  }, [])

  function startEdit(ev: ClanEvent) {
    setEditingId(ev.id)
    setDraft({ title: ev.title, date: ev.date, game: ev.game, description: ev.description || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function add(e: React.FormEvent) {
    e.preventDefault()
    const payload = { title: draft.title, date: draft.date, game: draft.game, description: draft.description }
    const query = editingId ? supabase.from('events').update(payload).eq('id', editingId) : supabase.from('events').insert([payload])
    const { error } = await query
    if (error) alert(error.message)
    else window.location.reload()
  }

  return (
    <>
      <div className="lg-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h2>{editingId ? 'Event bearbeiten' : 'Neues Event'}</h2>
        <form onSubmit={add} style={{ display: 'grid', gap: '0.8rem' }}>
          <input className="lg-input" placeholder="Titel" required value={draft.title} onChange={e => setDraft({...draft, title: e.target.value})} />
          <input className="lg-input" type="date" required value={draft.date} onChange={e => setDraft({...draft, date: e.target.value})} />
          <input className="lg-input" placeholder="Spiel" value={draft.game} onChange={e => setDraft({...draft, game: e.target.value})} />
          <textarea className="lg-textarea" placeholder="Beschreibung" value={draft.description} onChange={e => setDraft({...draft, description: e.target.value})} />
          <button className="lg-btn lg-btn-primary" type="submit">Speichern</button>
        </form>
      </div>
      {list.map(ev => (
        <div key={ev.id} className="lg-panel" style={{ padding: '1rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <div>{ev.date} - {ev.title} ({ev.game})</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="lg-btn" onClick={() => startEdit(ev)}>Bearbeiten</button>
            <button className="lg-btn lg-btn-danger" onClick={async () => {
                if(confirm('Löschen?')) {
                  await supabase.from('events').delete().eq('id', ev.id);
                  window.location.reload();
                }
              }}>Löschen</button>
          </div>
        </div>
      ))}
    </>
  )
}
