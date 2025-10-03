import { useState, useEffect } from "react";
import { FaDumbbell, FaHistory, FaCheckCircle } from "react-icons/fa";

const workoutsData = {
  Monday: [
    { id: 1, name: "Chest Press Machine", sets: 4, reps: [8, 10, 12], notes: "Stability and progressive overload", caloriesPerSet: 8 },
    { id: 2, name: "Shoulder Press Machine", sets: 3, reps: [8, 10, 12], notes: "Control the weight going down", caloriesPerSet: 7 },
    { id: 3, name: "Pec Fly Machine", sets: 3, reps: [12, 15], notes: "Focus on squeezing the chest", caloriesPerSet: 6 },
    // Add more exercises...
  ],
  Tuesday: [
    { id: 7, name: "Seated Leg Press", sets: 4, reps: [10, 12], notes: "Full range of motion", caloriesPerSet: 9 },
    // Add more...
  ],
  // Add full week plan...
};

// Utility function to get today weekday string (Monday, Tuesday...)
function getToday() {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
}

export default function Home() {
  const [currentTab, setCurrentTab] = useState("today");
  const [completions, setCompletions] = useState(() => {
    // Load from localStorage if any
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("workoutCompletions");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const today = getToday();

  // Save completions to localStorage for persistence
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("workoutCompletions", JSON.stringify(completions));
    }
  }, [completions]);

  // Calculate calories for a workout day
  const calcCaloriesForDay = (day) => {
    const dayWorkouts = workoutsData[day] || [];
    // Sum: sets * calories per set for all completed exercises that day
    return dayWorkouts.reduce((acc, exercise) => {
      const completed = completions[day]?.[exercise.id];
      if (completed) {
        return acc + exercise.caloriesPerSet * completed.sets;
      }
      return acc;
    }, 0);
  };

  // Mark exercise done and save sets/reps
  function handleMarkDone(day, exerciseId, sets, reps) {
    setCompletions((prev) => {
      const dayData = prev[day] || {};
      dayData[exerciseId] = { sets, reps };
      return { ...prev, [day]: dayData };
    });
  }

  // Navigate tab buttons
  const tabs = [
    { id: "today", label: "Today's Workout", icon: <FaDumbbell /> },
    { id: "history", label: "History", icon: <FaHistory /> },
  ];

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            style={{ ...styles.navButton, ...(currentTab === tab.id ? styles.navButtonActive : {}) }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>

      {currentTab === "today" && (
        <main style={styles.content}>
          <h2 style={styles.heading}>
            {today}'s Workout
          </h2>
          {(workoutsData[today] || []).map((exercise) => {
            const done = completions[today]?.[exercise.id] || {};
            return (
              <div key={exercise.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3>{exercise.name}</h3>
                  {done.sets && done.reps ? <FaCheckCircle color="green" size={20} /> : null}
                </div>
                <p style={styles.notes}>{exercise.notes}</p>

                <label>
                  Sets:
                  <select
                    value={done.sets || ""}
                    onChange={(e) => handleMarkDone(today, exercise.id, parseInt(e.target.value), done.reps || exercise.reps[0])}
                    style={styles.select}
                  >
                    {[3, 4].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Reps:
                  <select
                    value={done.reps || ""}
                    onChange={(e) => handleMarkDone(today, exercise.id, done.sets || exercise.sets, parseInt(e.target.value))}
                    style={styles.select}
                  >
                    {exercise.reps.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </label>
              </div>
            );
          })}
          <p style={styles.calorie}>Estimated Calories Burned Today: {calcCaloriesForDay(today)}</p>
        </main>
      )}

      {currentTab === "history" && (
        <main style={styles.content}>
          <h2 style={styles.heading}>Workout History</h2>
          {Object.keys(completions).length === 0 && <p>You have no workout records yet.</p>}
          {Object.entries(completions).map(([day, exercises]) => (
            <div key={day} style={styles.historyCard}>
              <h3>{day}</h3>
              <ul>
                {Object.entries(exercises).map(([exId, { sets, reps }]) => {
                  const ex = (workoutsData[day] || []).find((w) => w.id === parseInt(exId));
                  return (
                    <li key={exId}>
                      {ex?.name || "Exercise"} - Sets: {sets}, Reps: {reps}
                    </li>
                  );
                })}
              </ul>
              <p>Calories Burned: {calcCaloriesForDay(day)}</p>
            </div>
          ))}
        </main>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 480,
    margin: "0 auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 16,
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },
  nav: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
  },
  navButton: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#555",
    borderRadius: 8,
  },
  navButtonActive: {
    backgroundColor: "#3182ce",
    color: "#fff",
    fontWeight: "bold",
    boxShadow: "0 2px 8px rgba(49, 130, 206, 0.5)",
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    boxShadow: "0 1px 10px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: 16,
    color: "#2c5282",
  },
  card: {
    borderBottom: "1px solid #eee",
    paddingBottom: 12,
    marginBottom: 12,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notes: {
    fontSize: 14,
    color: "#666",
  },
  select: {
    marginLeft: 8,
    marginRight: 16,
    padding: "4px 8px",
    fontSize: 14,
  },
  calorie: {
    marginTop: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2f855a",
  },
  historyCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#f7fafc",
  },
};

