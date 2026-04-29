import { useMemo } from 'react'
import news from '@/data/news.json'
import settings from '@/data/settings.json'
import type { NewsItem } from '@/lib/types'

/**
 * Horizontaler News-Ticker. Animation per CSS keyframes
 * (siehe styles.css → .lg-ticker-track / @keyframes lg-ticker-slide).
 *
 * Geschwindigkeit kommt aus settings.json (tickerSpeed in Sekunden für eine
 * komplette Runde). Der Track ist verdoppelt → nahtlos endlos.
 *
 * TODO (later): Daten aus einer API/DB laden statt aus dem JSON-File,
 * sobald ein Admin-Backend existiert.
 */
export function NewsTicker() {
  const items = news as NewsItem[]
  const speed = settings.tickerSpeed ?? 35

  const doubled = useMemo(() => [...items, ...items], [items])

  return (
    <div className="lg-ticker">
      <div
        className="lg-ticker-track"
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((n, i) => (
          <span
            key={`${n.id}-${i}`}
            className="lg-ticker-item"
            style={{ color: n.color }}
          >
            <span aria-hidden>›</span>
            <strong style={{ fontWeight: 600 }}>[{n.category}]</strong>
            <span style={{ color: 'var(--clr-text)' }}>{n.text}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
