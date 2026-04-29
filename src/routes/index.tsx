import { Link, createFileRoute } from '@tanstack/react-router'
import settings from '@/data/settings.json'
import members from '@/data/members.json'
import events from '@/data/events.json'
import videos from '@/data/videos.json'
import type { ClanEvent, Member, VideoItem } from '@/lib/types'
import { OnlineLamp } from '@/components/OnlineLamp'
import { MemberCard } from '@/components/MemberCard'
import { EventCard } from '@/components/EventCard'
import { VideoCard } from '@/components/VideoCard'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const featuredMembers = (members as Member[]).slice(0, 3)
  const upcomingEvents = (events as ClanEvent[])
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 2)
  const featuredVideos = (videos as VideoItem[]).slice(0, 2)

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '1.5rem 1.25rem 0' }}>
      {/* ----- Banner ----- */}
      <section className="lg-banner" style={{ aspectRatio: '24 / 9', minHeight: 260 }}>
        {/* Banner-Bild kommt aus settings.json → kann später über Admin/API gesetzt werden. */}
        <img src={settings.bannerUrl} alt={`${settings.clanName} Banner`} />
        <div className="lg-banner-overlay">
          <div
            className="mono"
            style={{
              color: 'var(--clr-accent-arc)',
              letterSpacing: '0.2em',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
            }}
          >
            {/* optional label removed */}
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.6rem)',
              margin: '0.4rem 0',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Willkommen bei <span style={{ color: 'var(--clr-accent-arc)' }}>{settings.clanName}</span>
          </h1>

          <p style={{ margin: 0, maxWidth: 720, color: 'var(--clr-text)', fontSize: '1.05rem' }}>
            {settings.clanTagline}. Fokus auf Teamplay, Fairness und Spaß.
          </p>

          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.2rem', flexWrap: 'wrap' }}>
            <a className="lg-btn lg-btn-primary" href={settings.discordUrl} target="_blank" rel="noreferrer">
              <OnlineLamp /> Zum Discord-Server
            </a>
            <a className="lg-btn" href={settings.twitchUrl} target="_blank" rel="noreferrer">
              <OnlineLamp /> Zum Twitch-Channel
            </a>
            <Link className="lg-btn lg-btn-pubg" to="/bewerbung">
              Jetzt bewerben
            </Link>
          </div>
        </div>
      </section>

      {/* ----- Welcome / Mission ----- */}
      <section style={{ marginTop: '2.5rem' }}>
        <div className="lg-panel lg-glow-arc" style={{ padding: '1.6rem 1.8rem' }}>
          <div className="mono lg-muted" style={{ fontSize: '0.78rem', letterSpacing: '0.18em' }}>
            // ÜBER UNS
          </div>
          <h2 style={{ marginTop: '0.4rem', fontSize: '1.6rem' }}>
            Wir sind PC-Gamer, keine Rookies
          </h2>
          <p style={{ maxWidth: 820, lineHeight: 1.6, color: 'var(--clr-text)' }}>
            Leider Geil ist ein freundlicher PC-Clan mit Schwerpunkt auf{' '}
            <strong style={{ color: 'var(--clr-accent-pubg)' }}>PUBG</strong> und{' '}
            <strong style={{ color: 'var(--clr-accent-arc)' }}>ARC Raiders</strong>. Wir spielen
            außerdem regelmäßig weitere Multiplayer-Titel zusammen. Bei uns zählen Teamplay,
            Fairness und ein offenes Discord für alle.
          </p>
        </div>
      </section>

      {/* ----- Feature Grid ----- */}
      <section
        style={{
          marginTop: '2.5rem',
          display: 'grid',
          gap: '1.2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        {/* Roster Teaser */}
        <div className="lg-panel" style={{ padding: '1.4rem' }}>
          <SectionHead label="// ROSTER" title="Unsere Squad" link={{ to: '/roster', label: 'Komplettes Roster' }} />
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            {featuredMembers.map((m) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <img src={m.avatar} alt={m.name} className="lg-avatar" style={{ width: 44, height: 44 }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-headline)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {m.name}
                  </div>
                  <div className="lg-muted" style={{ fontSize: '0.8rem' }}>
                    {m.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events Teaser */}
        <div className="lg-panel" style={{ padding: '1.4rem' }}>
          <SectionHead label="// EVENTS" title="Kommende Events" link={{ to: '/events', label: 'Alle Events' }} />
          <div style={{ display: 'grid', gap: '0.7rem' }}>
            {upcomingEvents.map((e) => (
              <div key={e.id} style={{ borderLeft: '3px solid var(--clr-accent-arc)', paddingLeft: '0.7rem' }}>
                <div style={{ fontWeight: 600 }}>{e.title}</div>
                <div className="mono lg-muted" style={{ fontSize: '0.78rem' }}>
                  {new Date(e.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })} · {e.game}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Videos Teaser */}
        <div className="lg-panel" style={{ padding: '1.4rem' }}>
          <SectionHead label="// VIDEOS" title="Highlights" link={{ to: '/videos', label: 'Galerie öffnen' }} />
          <div style={{ display: 'grid', gap: '0.7rem' }}>
            {featuredVideos.map((v) => (
              <a
                key={v.id}
                href={v.url}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', color: 'var(--clr-text)' }}
              >
                <img
                  src={v.thumbnail}
                  alt=""
                  style={{ width: 70, height: 44, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--clr-border)' }}
                />
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 500 }}>{v.title}</div>
                  <div className="lg-muted mono" style={{ fontSize: '0.72rem' }}>
                    {v.platform}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Larger feature blocks */}
      <section style={{ marginTop: '2.5rem' }}>
        <SectionHead label="// SQUAD" title="Featured Members" />
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {featuredMembers.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      </section>

      <section style={{ marginTop: '2.5rem' }}>
        <SectionHead label="// EVENTS" title="Demnächst" />
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {upcomingEvents.map((e) => (
            <EventCard key={e.id} event={e} showSignup />
          ))}
        </div>
      </section>

      <section style={{ marginTop: '2.5rem' }}>
        <SectionHead label="// VIDEOS" title="Galerie" />
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {featuredVideos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </section>
    </div>
  )
}

interface SectionHeadProps {
  label: string
  title: string
  link?: { to: string; label: string }
}
function SectionHead({ label, title, link }: SectionHeadProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem' }}>
      <div>
        <div className="mono lg-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.18em' }}>
          {label}
        </div>
        <h2 style={{ margin: '0.3rem 0 0', fontSize: '1.4rem' }}>{title}</h2>
      </div>
      {link && (
        <Link to={link.to} className="lg-btn" style={{ padding: '0.45rem 0.9rem', fontSize: '0.78rem' }}>
          {link.label} →
        </Link>
      )}
    </div>
  )
}