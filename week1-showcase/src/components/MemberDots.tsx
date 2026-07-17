interface MemberDotsProps {
  count: number
  colors?: string[]
}

export function MemberDots({ count, colors }: MemberDotsProps) {
  if (colors) {
    return (
      <div style={{ display: 'flex' }}>
        {colors.map((color, i) => (
          <div key={i} style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            border: `1px solid ${color}`,
            background: 'transparent',
            marginLeft: i > 0 ? -6 : 0,
          }} />
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex' }}>
      {Array.from({ length: Math.min(count, 2) }).map((_, i) => (
        <div key={i} style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          border: '1.5px solid #BCBECA',
          background: 'white',
          marginLeft: i > 0 ? -6 : 0,
        }} />
      ))}
      {count > 2 && (
        <div style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          border: '1.5px solid #BCBECA',
          background: 'white',
          marginLeft: -6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.5rem',
          color: 'var(--color-text-secondary)',
          fontWeight: 600,
        }}>
          +{count}
        </div>
      )}
    </div>
  )
}
