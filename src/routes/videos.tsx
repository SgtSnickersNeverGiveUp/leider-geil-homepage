import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import videos from '@/data/videos.json'
import type { VideoItem } from '@/lib/types'
import { VideoCard } from '@/components/VideoCard'
import { Modal } from '@/components/Modal'
import { PageHeader } from './roster'

export const Route = createFileRoute('/videos')({
  component: VideosPage,
})

/**
 * YouTube-URL → Embed-URL. Bei Twitch / sonstigen Plattformen einfach Link öffnen.
 */
function youtubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : null
}

function VideosPage() {
  const list = videos as VideoItem[]
  const [active, setActive] = useState<VideoItem | null>(null)
  const embed = active ? youtubeEmbed(active.url) : null

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.25rem' }}>
      <PageHeader label="// VIDEOS" title="Video-Galerie" subtitle="Highlights, Streams und Vods." />
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {list.map((v) => (
          <VideoCard key={v.id} video={v} onPlay={setActive} />
        ))}
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.title ?? ''}>
        {active && (
          <>
            {embed ? (
              <div style={{ aspectRatio: '16 / 9' }}>
                <iframe
                  src={embed}
                  title={active.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 'none', borderRadius: 8 }}
                />
              </div>
            ) : (
              <p>
                Externer Player – <a href={active.url} target="_blank" rel="noreferrer">Video auf {active.platform} öffnen</a>.
              </p>
            )}
            <p style={{ marginTop: '0.8rem', color: 'var(--clr-text-muted)' }}>{active.description}</p>
          </>
        )}
      </Modal>
    </div>
  )
}
