/**
 * Sovereign Protocol — Risk Score Gauge (Module 4)
 * SVG arc gauge showing proposal risk level (0-100).
 * Green (<30), Amber (<70), Red (>=70).
 */
function RiskScoreGauge({ score = 0, size = 64 }) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = (size - 8) / 2;
  const circumference = Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const getColor = (s) => {
    if (s < 30) return '#E8943A';
    if (s < 70) return '#D4842E';
    return '#6B4226';
  };

  const getLabel = (s) => {
    if (s < 30) return 'LOW';
    if (s < 70) return 'MEDIUM';
    return 'HIGH';
  };

  const color = getColor(clamped);

  return (
    <div className="risk-gauge">
      <svg width={size} height={size / 2 + 8} viewBox={`0 0 ${size} ${size / 2 + 8}`}>
        {/* Background arc */}
        <path
          d={`M 4 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 4} ${size / 2}`}
          fill="none"
          stroke="#1e293b"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={`M 4 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 4} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="risk-gauge-value" style={{ color }}>{clamped}</div>
      <div className="risk-gauge-label">{getLabel(clamped)}</div>
    </div>
  );
}

export { RiskScoreGauge };
