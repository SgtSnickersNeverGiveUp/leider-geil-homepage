import { createFileRoute } from '@tanstack/react-router'
import events from '@/data/events.json'
import milestones from '@/data/milestones.json'
import type { ClanEvent, Milestone } from '@/lib/types'
import { EventCard } from '@/components/EventCard'
import { Timeline } from '@/components/Timeline'
import { PageHeader } from './roster'

export const Route = createFileRoute('/events')({
  component: EventsPage,
})

function EventsPage() {
  const list = (events as ClanEvent[]).slice().sort((a, b) => a.date.localeCompare(b.date))
  const ms = milestones as Milestone[]

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.25rem' }}>
      <PageHeader label="// EVENTS" title="Events & Meilensteine" subtitle="Was passiert – und was passiert ist." />

      <h2 style={{ fontSize: '1.4rem', marginTop: 0 }}>Kommende Events</h2>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {list.map((e) => (
          <EventCard key={e.id} event={e} showSignup />
        ))}
      </div>

      <hr className="lg-divider" />

      <h2 style={{ fontSize: '1.4rem' }}>Meilensteine</h2>
      <Timeline items={ms} />
    </div>
  )
}
