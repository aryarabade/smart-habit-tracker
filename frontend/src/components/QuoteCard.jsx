const quotes = [
  { text: "Small daily improvements lead to stunning results.", author: "Robin Sharma" },
  { text: "Motivation gets you started. Habit keeps you going.", author: "Jim Ryun" },
  { text: "You don't rise to the level of your goals, you fall to the level of your systems.", author: "James Clear" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
];

const QuoteCard = () => {
  const dayIndex = new Date().getDay();
  const quote    = quotes[dayIndex];

  return (
    <div style={styles.container}>
      <span style={styles.icon}>💡</span>
      <div>
        <p style={styles.text}>"{quote.text}"</p>
        <p style={styles.author}>— {quote.author}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background:    "linear-gradient(135deg, #2d6a4f, #40916c)",
    borderRadius:  "16px",
    padding:       "20px 24px",
    display:       "flex",
    alignItems:    "flex-start",
    gap:           "16px",
    marginBottom:  "24px",
    boxShadow:     "0 4px 20px rgba(45,106,79,0.3)",
  },
  icon: {
    fontSize: "28px",
    marginTop:"2px",
  },
  text: {
    color:      "#ffffff",
    fontSize:   "15px",
    fontStyle:  "italic",
    lineHeight: "1.6",
    marginBottom:"6px",
  },
  author: {
    color:    "#b7e4c7",
    fontSize: "13px",
    fontWeight:"600",
  },
};

export default QuoteCard;