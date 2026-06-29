import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

const useReminders = () => {
  const intervalRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const checkNow = async () => {
      try {
        const cleanToken = token.trim().replace(/[\r\n\t"]/g, "");

        const res = await fetch(
          "http://localhost:5000/api/notifications/pending",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${cleanToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) return;

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          data.forEach((n) => {
            // force toast to show
            setTimeout(() => {
              toast.success(`⏰ ${n.message}`, {
                duration: 20000,
                position: "top-center",
                style: {
                  background:   "#2d6a4f",
                  color:        "#fff",
                  fontSize:     "16px",
                  fontWeight:   "bold",
                  padding:      "20px 28px",
                  borderRadius: "14px",
                  boxShadow:    "0 8px 32px rgba(0,0,0,0.4)",
                  minWidth:     "340px",
                  zIndex:       99999,
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "#2d6a4f",
                },
              });
            }, 100);
          });
        }
      } catch (err) {
        console.log("Reminder check error:", err.message);
      }
    };

    // check immediately on load
    checkNow();

    // check every 30 seconds (more frequent!)
    intervalRef.current = setInterval(checkNow, 30000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
};

export default useReminders;