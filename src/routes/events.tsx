function EventsPage() {
  const [list, setList] = useState<ClanEvent[]>([])
  const [loading, setLoading] = useState(true)

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

  const ms = milestones as Milestone[]

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.25rem' }}>
      <PageHeader
        label="// EVENTS"
        title="Events & Meilensteine"
        subtitle="Was passiert – und was passiert ist."
      />

      <h2 style={{ fontSize: '1.4rem', marginTop: 0 }}>Kommende Events</h2>

      {loading && (
        <div className="lg-muted mono" style={{ fontSize: '0.85rem' }}>
          Lade Events…
        </div>
      )}

      {!loading && (
        <div
          style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          }}
        >
          {list.map((e) => (
            <EventCard key={e.id} event={e} showSignup />
          ))}
        </div>
      )}

      <hr className="lg-divider" />

      <h2 style={{ fontSize: '1.4rem' }}>Meilensteine</h2>
      <Timeline items={ms} />
    </div>
  )
}
