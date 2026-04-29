/**
 * <OnlineLamp /> – kleine, grün leuchtende, pulsierende Lampe.
 * Wird neben Discord/Twitch-Buttons platziert um „online" anzudeuten.
 *
 * TODO (later): Tatsächlichen Online-Status per Discord-/Twitch-API
 * abfragen und Farbe/Animation daran knüpfen.
 */
export function OnlineLamp({ label }: { label?: string }) {
  return (
    <span
      className="lg-lamp"
      role="status"
      aria-label={label ?? 'Online'}
      title={label ?? 'Online'}
    />
  )
}
