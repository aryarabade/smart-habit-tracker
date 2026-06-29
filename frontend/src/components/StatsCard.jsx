const StatsCard = ({ icon, number, label, color }) => {
  return (
    <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
      <span style={styles.icon}>{icon}</span>
      <span style={{ ...styles.number, color }}>{number}</span>
      <span style={styles.label}>{label}</span>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#ffffff",
    borderRadius:    "16px",
    padding:         "20px",
    boxShadow:       "0 4px 15px rgba(0,0,0,0.08)",
    display:         "flex",
    flexDirection:   "column",
    alignItems:      "center",
    gap:             "8px",
    transition:      "transform 0.2s, box-shadow 0.2s",
    cursor:          "default",
  },
  icon: {
    fontSize: "32px",
  },
  number: {
    fontSize:   "36px",
    fontWeight: "800",
  },
  label: {
    fontSize:  "13px",
    color:     "#888",
    textAlign: "center",
  },
};

export default StatsCard;