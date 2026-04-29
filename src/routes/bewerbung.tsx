import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PageHeader } from './roster'

export const Route = createFileRoute('/bewerbung')({
  component: BewerbungPage,
})

/**
 * Hilfsfunktion: serialisiert ein Objekt in form-urlencoded Format.
 * Netlify Forms verlangt application/x-www-form-urlencoded, nicht JSON.
 */
function encode(data: Record<string, string>) {
  return Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
}

interface FormState {
  nickname: string
  alter: string
  spiele: string[]
  plattform: string
  erfahrung: string
  spielzeiten: string
  motivation: string
  discord: string
  botField: string
}

const initial: FormState = {
  nickname: '',
  alter: '',
  spiele: [],
  plattform: 'PC',
  erfahrung: '',
  spielzeiten: '',
  motivation: '',
  discord: '',
  botField: '',
}

function BewerbungPage() {
  const [form, setForm] = useState<FormState>(initial)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function toggleSpiel(s: string) {
    setForm((f) => ({
      ...f,
      spiele: f.spiele.includes(s) ? f.spiele.filter((x) => x !== s) : [...f.spiele, s],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      // POST gegen das statische public/__forms.html – dort ist das Formular „bewerbung"
      // bei Netlify zur Build-Zeit registriert.
      const body = encode({
        'form-name': 'bewerbung',
        'bot-field': form.botField,
        nickname: form.nickname,
        alter: form.alter,
        spiele: form.spiele.join(', '),
        plattform: form.plattform,
        erfahrung: form.erfahrung,
        spielzeiten: form.spielzeiten,
        motivation: form.motivation,
        discord: form.discord,
      })
      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      })
      if (!res.ok) throw new Error('Fehler bei der Übertragung')
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
          <h1 style={{ marginTop: 0 }}>Danke für deine Bewerbung!</h1>
          <p>Wir melden uns bei dir – schau parallel gern auf unserem Discord vorbei.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.25rem' }}>
      <PageHeader
        label="// BEWERBUNG"
        title="Werde Teil von Leider Geil"
        subtitle="Fülle das Formular aus – wir melden uns innerhalb weniger Tage."
      />

      <form
        name="bewerbung"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        className="lg-panel"
        style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}
      >
        {/* Pflichtfeld: zeigt Netlify, welche Form gemeint ist */}
        <input type="hidden" name="form-name" value="bewerbung" />
        {/* Honeypot: echte Nutzer lassen das Feld leer */}
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

        <Field label="Nickname">
          <input
            className="lg-input"
            required
            value={form.nickname}
            onChange={(e) => update('nickname', e.target.value)}
          />
        </Field>

        <Field label="Alter">
          <input
            type="number"
            className="lg-input"
            min={13}
            required
            value={form.alter}
            onChange={(e) => update('alter', e.target.value)}
          />
        </Field>

        <Field label="Hauptspiel(e)">
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {['PUBG', 'ARC Raiders', 'Beides', 'Andere'].map((s) => (
              <label key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <input
                  type="checkbox"
                  checked={form.spiele.includes(s)}
                  onChange={() => toggleSpiel(s)}
                />
                <span className={s === 'PUBG' ? 'lg-tag lg-tag-pubg' : s === 'ARC Raiders' ? 'lg-tag lg-tag-arc' : 'lg-tag'}>{s}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Plattform">
          <select
            className="lg-select"
            value={form.plattform}
            onChange={(e) => update('plattform', e.target.value)}
          >
            <option>PC</option>
            <option>Steam</option>
            <option>Epic</option>
            <option>Andere</option>
          </select>
        </Field>

        <Field label="Erfahrung / Rank">
          <input
            className="lg-input"
            placeholder="z.B. Diamond, 1500 Stunden, Stream-Erfahrung"
            value={form.erfahrung}
            onChange={(e) => update('erfahrung', e.target.value)}
          />
        </Field>

        <Field label="Bevorzugte Spielzeiten">
          <input
            className="lg-input"
            placeholder="z.B. wochentags ab 20 Uhr"
            value={form.spielzeiten}
            onChange={(e) => update('spielzeiten', e.target.value)}
          />
        </Field>

        <Field label='Warum willst du zu „Leider Geil"?'>
          <textarea
            className="lg-textarea"
            required
            value={form.motivation}
            onChange={(e) => update('motivation', e.target.value)}
          />
        </Field>

        <Field label="Discord-Name">
          <input
            className="lg-input"
            required
            placeholder="z.B. ghostwolf#1234"
            value={form.discord}
            onChange={(e) => update('discord', e.target.value)}
          />
        </Field>

        {status === 'error' && (
          <p style={{ color: 'var(--clr-danger)' }}>
            Da ist etwas schiefgelaufen. Bitte später nochmal probieren.
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="lg-btn lg-btn-primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sende …' : 'Bewerbung absenden'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block' }}>
      <span className="lg-label">{label}</span>
      {children}
    </label>
  )
}
