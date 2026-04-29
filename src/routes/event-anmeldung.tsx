import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PageHeader } from './roster'

export const Route = createFileRoute('/event-anmeldung')({
  component: EventAnmeldungPage,
  validateSearch: (search: Record<string, unknown>) => ({
    event: typeof search.event === 'string' ? search.event : undefined,
  }),
})

function encode(data: Record<string, string>) {
  return Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
}

function EventAnmeldungPage() {
  const search = Route.useSearch()
  const [form, setForm] = useState({
    name: '',
    email: '',
    spiel: 'PUBG',
    clan: '',
    spieler: '4',
    bemerkungen: '',
    eventId: search.event ?? '',
    botField: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const body = encode({
        'form-name': 'event-anmeldung',
        'bot-field': form.botField,
        name: form.name,
        email: form.email,
        spiel: form.spiel,
        clan: form.clan,
        spieler: form.spieler,
        bemerkungen: form.bemerkungen,
        eventId: form.eventId,
      })
      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      })
      if (!res.ok) throw new Error('Fehler')
      setStatus('success')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1.25rem' }}>
        <div className="lg-panel lg-glow-arc" style={{ padding: '2rem', textAlign: 'center' }}>
          <h1 style={{ marginTop: 0 }}>Anmeldung eingegangen!</h1>
          <p>Wir kontaktieren dich vor dem Event mit allen Details.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.25rem' }}>
      <PageHeader
        label="// EVENT-ANMELDUNG"
        title="Für ein Event anmelden"
        subtitle="Trag dich oder dein Team hier ein – wir melden uns mit Details."
      />

      <form
        name="event-anmeldung"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        className="lg-panel"
        style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}
      >
        <input type="hidden" name="form-name" value="event-anmeldung" />
        <input type="hidden" name="eventId" value={form.eventId} />
        <p hidden>
          <label>
            Nicht ausfüllen:{' '}
            <input
              name="bot-field"
              value={form.botField}
              onChange={(e) => update('botField', e.target.value)}
            />
          </label>
        </p>

        <label>
          <span className="lg-label">Name / Gaming-ID</span>
          <input className="lg-input" required value={form.name} onChange={(e) => update('name', e.target.value)} />
        </label>

        <label>
          <span className="lg-label">E-Mail</span>
          <input className="lg-input" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
        </label>

        <label>
          <span className="lg-label">Spiel</span>
          <select className="lg-select" value={form.spiel} onChange={(e) => update('spiel', e.target.value)}>
            <option>PUBG</option>
            <option>ARC Raiders</option>
            <option>Mixed</option>
          </select>
        </label>

        <label>
          <span className="lg-label">Clan-Name (optional)</span>
          <input className="lg-input" value={form.clan} onChange={(e) => update('clan', e.target.value)} />
        </label>

        <label>
          <span className="lg-label">Anzahl Spieler</span>
          <input className="lg-input" type="number" min={1} max={32} value={form.spieler} onChange={(e) => update('spieler', e.target.value)} />
        </label>

        <label>
          <span className="lg-label">Bemerkungen</span>
          <textarea className="lg-textarea" value={form.bemerkungen} onChange={(e) => update('bemerkungen', e.target.value)} />
        </label>

        {form.eventId && (
          <p className="lg-muted mono" style={{ fontSize: '0.78rem' }}>
            Event-ID: {form.eventId}
          </p>
        )}
        {status === 'error' && (
          <p style={{ color: 'var(--clr-danger)' }}>
            Da ist etwas schiefgelaufen. Bitte später nochmal probieren.
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="lg-btn lg-btn-primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sende …' : 'Anmeldung absenden'}
          </button>
        </div>
      </form>
    </div>
  )
}
