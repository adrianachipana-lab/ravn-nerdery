/*
  Utilidad para formatear fechas y calcular el color
  según proximidad al vencimiento (bonus point del challenge).

  Verde: a tiempo (más de 2 días)
  Amarillo: menos de 2 días
  Rojo: ya pasó la fecha
*/

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export type DateColor = 'green' | 'yellow' | 'red';

export function getDateColor(dateString: string): DateColor {
  const now = new Date();
  const dueDate = new Date(dateString);
  const diffMs = dueDate.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return 'red';
  if (diffDays <= 2) return 'yellow';
  return 'green';
}

export function getPointLabel(pointEstimate: string): string {
  const map: Record<string, string> = {
    ZERO: '0 Points',
    ONE: '1 Point',
    TWO: '2 Points',
    FOUR: '4 Points',
    EIGHT: '8 Points',
  };
  return map[pointEstimate] ?? pointEstimate;
}
