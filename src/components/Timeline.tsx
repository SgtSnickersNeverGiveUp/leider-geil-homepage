import type { Milestone } from '@/lib/types'

export function Timeline({ items }: { items: Milestone[] }) {
  return (
    <ol className="lg-timeline" style={{ listStyle: 'none', margin: 0, padding: '0 0 0 1.5rem' }}>
      {items.map((m, idx) => (
        <li key={m.id} style={{ position: 'relative', marginBottom: idx === items.length - 1 ? 0 : '1.4rem' }}>
          <span className="lg-timeline-dot" style={{ top: '6px' }} />
          <div className="lg-panel" style={{ padding: '1rem 1.1rem' }}>
            <div
              className="mono"
              style={{
                color: 'var(--clr-accent-arc)',
                fontSize: '0.8rem',
                letterSpacing: '0.06em',
                marginBottom: '0.2rem',
              }}
            >
              {m.year}
            </div>
            <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.05rem' }}>{m.title}</h3>
            <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.5 }}>{m.description}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
