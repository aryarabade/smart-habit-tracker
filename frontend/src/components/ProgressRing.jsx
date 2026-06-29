const ProgressRing = ({ completed, total }) => {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const radius     = 54;
  const stroke     = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference    = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 80) return "#2d6a4f";
    if (percentage >= 50) return "#f9a825";
    return "#e53935";
  };

  return (
    <div style={styles.container}>
      <svg height={radius * 2} width={radius * 2}>
        {/* Background circle */}
        <circle
          stroke="#e0e0e0"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress circle */}
        <circle
          stroke={getColor()}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{ transition: "stroke-dashoffset 0.8s ease", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
        />
        {/* Percentage text */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill={getColor()}
        >
          {percentage}%
        </text>
      </svg>
      <div style={styles.label}>
        <p style={styles.labelText}>Today's Progress</p>
        <p style={styles.labelCount}>
          {completed} of {total} done
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display:        "flex",
    alignItems:     "center",
    gap:            "16px",
  },
  label: {
    display:       "flex",
    flexDirection: "column",
    gap:           "4px",
  },
  labelText: {
    fontSize:   "14px",
    color:      "#777",
    fontWeight: "600",
  },
  labelCount: {
    fontSize:   "20px",
    fontWeight: "bold",
    color:      "#333",
  },
};

export default ProgressRing;