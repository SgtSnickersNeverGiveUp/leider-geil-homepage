import type { ReactNode } from 'react'

interface Props {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ open, title, onClose, children }: Props) {
  if (!open) return null
  return (
    <div className="lg-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="lg-modal" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{title}</h2>
          <button
            className="lg-btn"
            style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}
            onClick={onClose}
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
