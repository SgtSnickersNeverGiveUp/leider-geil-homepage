import type { VideoItem } from '@/lib/types'

interface Props {
  video: VideoItem
  onPlay?: (v: VideoItem) => void
  onDelete?: (v: VideoItem) => void
}

export function VideoCard({ video, onPlay, onDelete }: Props) {
  return (
    <article
      className="lg-panel"
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <button
        type="button"
        onClick={() => onPlay?.(video)}
        style={{
          display: 'block',
          padding: 0,
          border: 'none',
          cursor: onPlay ? 'pointer' : 'default',
          background: 'var(--clr-surface-alt)',
          aspectRatio: '16 / 9',
        }}
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </button>
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.6rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem' }}>{video.title}</h3>
          <span
            className={
              'lg-tag ' +
              (video.platform === 'YouTube'
                ? 'lg-tag-pubg'
                : video.platform === 'Twitch'
                  ? 'lg-tag-arc'
                  : '')
            }
          >
            {video.platform}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--clr-text-muted)', lineHeight: 1.45 }}>
          {video.description}
        </p>
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: 'auto' }}>
          <a className="lg-btn" href={video.url} target="_blank" rel="noreferrer" style={{ flex: 1, justifyContent: 'center' }}>
            Ansehen
          </a>
          {onDelete && (
            <button className="lg-btn lg-btn-danger" onClick={() => onDelete(video)} style={{ flex: 1 }}>
              Löschen
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
