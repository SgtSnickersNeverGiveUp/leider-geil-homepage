import { createFileRoute } from '@tanstack/react-router'
import settings from '@/data/settings.json'
import { OnlineLamp } from '@/components/OnlineLamp'
import { PageHeader } from './roster'

export const Route = createFileRoute('/kontakt')({
  component: KontaktPage,
})

function KontaktPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.25rem' }}>
      <PageHeader
        label="// KONTAKT"
        title="Kontakt & Discord"
        subtitle="Schreib uns – am schnellsten erreichst du uns auf Discord."
      />

      <div className="lg-panel" style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <OnlineLamp />
          <span className="lg-headline" style={{ fontSize: '0.85rem' }}>Live verfügbar</span>
        </div>

        <a className="lg-btn lg-btn-primary" href={settings.discordUrl} target="_blank" rel="noreferrer" style={{ justifyContent: 'center' }}>
          <OnlineLamp /> Zum Discord-Server
        </a>
        <a className="lg-btn" href={settings.twitchUrl} target="_blank" rel="noreferrer" style={{ justifyContent: 'center' }}>
          <OnlineLamp /> Zum Twitch-Channel
        </a>
        <a className="lg-btn" href={settings.youtubeUrl} target="_blank" rel="noreferrer" style={{ justifyContent: 'center' }}>
          YouTube-Kanal
        </a>

        <hr className="lg-divider" />

        <div>
          <span className="lg-label">E-Mail</span>
          <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
        </div>
      </div>
    </div>
  )
}
