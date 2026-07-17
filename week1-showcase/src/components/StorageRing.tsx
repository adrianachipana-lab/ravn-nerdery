export function StorageRing() {
  const r = 52
  const circumference = 2 * Math.PI * r
  const strokeW = 7
  const gap = 12
  const innerR = r - strokeW - 3

  const orangeLen = circumference * 0.10
  const blueLen = circumference * 0.40
  const greenLen = circumference * 0.20
  const grayLen = circumference * 0.15

  let offset = 0
  const orangeOffset = -offset
  offset += orangeLen + gap
  const blueOffset = -offset
  offset += blueLen + gap
  const greenOffset = -offset
  offset += greenLen + gap
  const grayOffset = -offset

  return (
    <div className="storage-ring">
      <svg viewBox="0 0 130 130" className="storage-ring__svg">
        {/* Background track */}
        <circle cx="65" cy="65" r={r} fill="none" stroke="#e8e8ee" strokeWidth={strokeW} />
        {/* Orange */}
        <circle cx="65" cy="65" r={r} fill="none" stroke="#FF9F00" strokeWidth={strokeW}
          strokeDasharray={`${orangeLen} ${circumference - orangeLen}`}
          strokeDashoffset={orangeOffset}
          strokeLinecap="round"
          transform="rotate(-90 65 65)" />
        {/* Blue */}
        <circle cx="65" cy="65" r={r} fill="none" stroke="#689EF8" strokeWidth={strokeW}
          strokeDasharray={`${blueLen} ${circumference - blueLen}`}
          strokeDashoffset={blueOffset}
          strokeLinecap="round"
          transform="rotate(-90 65 65)" />
        {/* Green */}
        <circle cx="65" cy="65" r={r} fill="none" stroke="#4AC29D" strokeWidth={strokeW}
          strokeDasharray={`${greenLen} ${circumference - greenLen}`}
          strokeDashoffset={greenOffset}
          strokeLinecap="round"
          transform="rotate(-90 65 65)" />
        {/* Gray */}
        <circle cx="65" cy="65" r={r} fill="none" stroke="#BCBECA" strokeWidth={strokeW}
          strokeDasharray={`${grayLen} ${circumference - grayLen}`}
          strokeDashoffset={grayOffset}
          strokeLinecap="round"
          transform="rotate(-90 65 65)" />
        {/* White inner circle with gap from progress */}
        <circle cx="65" cy="65" r={innerR} fill="white" />
        {/* Text */}
        <text x="65" y="62" textAnchor="middle" fontSize="18" fontWeight="300" fill="#343951">85 %</text>
        <text x="65" y="76" textAnchor="middle" fontSize="9" fontWeight="300" fill="#6b7280">Used</text>
      </svg>
    </div>
  )
}
