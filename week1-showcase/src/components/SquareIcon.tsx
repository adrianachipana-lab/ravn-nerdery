export function SquareIcon({ color, size = 36, double, rounded }: { color: string; size?: number; double?: boolean; rounded?: boolean }) {
  const w = size
  const h = size - 3

  if (double) {
    return (
      <div style={{ position: 'relative', width: w + 6, height: h + 4, flexShrink: 0 }}>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: w - 4,
          height: h - 4,
          background: '#FFD999',
          borderRadius: 0,
        }} />
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: w - 4,
          height: h - 4,
          background: color,
          borderRadius: 0,
        }} />
      </div>
    )
  }

  return (
    <div style={{
      width: w,
      height: h,
      background: color,
      borderRadius: rounded ? 6 : 0,
      flexShrink: 0,
    }} />
  )
}
