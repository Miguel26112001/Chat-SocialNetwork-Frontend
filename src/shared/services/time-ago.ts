/**
 * Tiempo relativo en español ("hace 5 min", "hace 2 h", "12 oct").
 */
export function timeAgo(iso: string): string {
  const date = new Date(iso).getTime();
  if (Number.isNaN(date)) {
    return '';
  }
  const seconds = Math.max(0, Math.floor((Date.now() - date) / 1000));
  if (seconds < 60) {
    return 'ahora mismo';
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `hace ${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `hace ${hours} h`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return days === 1 ? 'ayer' : `hace ${days} días`;
  }
  return new Date(date).toLocaleDateString('es', { day: 'numeric', month: 'short' });
}
