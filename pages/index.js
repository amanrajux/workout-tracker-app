import { useState, useEffect } from "react";
import {
  FaDumbbell,
  FaHistory,
  FaListUl,
  FaMoon,
  FaSun,
  FaCheckCircle,
} from "react-icons/fa";

// Full week workout data (add all days needed)
const workoutsData = {
  Monday: [
    {
      id: 1,
      name: "Chest Press Machine",
      sets: 4,
      reps: [8, 10, 12],
      notes: "Stability and progressive overload",
      caloriesPerSet: 8,
    },
    {
      id: 2,
      name: "Shoulder Press Machine",
      sets: 3,
      reps: [8, 10, 12],
      notes: "Control the weight going down",
      caloriesPerSet: 7,
    },
    {
      id: 3,
      name: "Pec Fly Machine",
      sets: 3,
      reps: [12, 15],
      notes: "Focus on squeezing the chest",
      caloriesPerSet: 6,
    },
  ],
  Tuesday: [
    {
      id: 7,
      name: "Seated Leg Press",
      sets: 4,
      reps: [10, 12],
      notes: "Full range of motion",
      caloriesPerSet: 9,
    },
    {
      id: 8,
      name: "Leg Extension Machine",
      sets: 3,
      reps: [12, 15],
      notes: "Slow controlled squeeze",
      caloriesPerSet: 7,
    },
  ],
  Wednesday: [],
  Thursday: [
    {
      id: 20,
      name: "Lat Pulldown Machine",
      sets: 4,
      reps: [10, 12],
      notes: "Pull with elbows, squeeze back",
      caloriesPerSet: 8,
    },
  ],
  Friday: [
    {
      id: 30,
      name: "Seated Leg Curl Machine",
      sets: 4,
      reps: [10, 12],
      notes: "Heavier weight than Day 2",
      caloriesPerSet: 9,
    },
  ],
  Saturday: [
    {
      id: 40,
      name: "Elliptical Trainer Cardio",
      sets: 1,
      reps: [],
      notes: "45 mins steady state cardio",
      caloriesPerSet: 125,
    },
  ],
  Sunday: [],
};

// Utility to get current day name:
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const getToday = () => daysOfWeek[new Date().getDay()];

export default function Home() {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined")
      return localStorage.getItem("darkMode") === "true";
    return false;
  });

  // Persist dark mode preference
  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // App state: tab, workout completions loaded from localStorage
  const [currentTab, setCurrentTab] = useState("today");
  const [completions, setCompletions] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("workoutCompletions");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const today = getToday();

  // Save completions persistently
  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem("workoutCompletions", JSON.stringify(completions));
  }, [completions]);

  // Handle mark done sets/reps for given day and exercise
  function handleMarkDone(day, exerciseId, sets, reps) {
    setCompletions((prev) => {
      const dayData = prev[day] || {};
      dayData[exerciseId] = { sets, reps };
      return { ...prev, [day]: dayData };
    });
  }

  // Calculate calories burned for a day
  const calcCaloriesForDay = (day) => {
    const dayWorkouts = workoutsData[day] || [];
    return dayWorkouts.reduce((acc, exercise) => {
      const completed = completions[day]?.[exercise.id];
      if (completed) {
        return acc + exercise.caloriesPerSet * completed.sets;
      }
      return acc;
    }, 0);
  };

  // Animation styles (fade + scale)
  const animStyle = {
    transition: "all 0.3s ease",
    opacity: 1,
    transform: "scale(1)",
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="container">
        <header className="header">
          <h1>Workout Tracker</h1>
          <button
            className="dark-toggle"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </header>

        <nav className="nav">
          <button
            onClick={() => setCurrentTab("today")}
            className={currentTab === "today" ? "active" : ""}
            aria-label="Today's Workout Tab"
          >
            <FaDumbbell /> Today
          </button>
          <button
            onClick={() => setCurrentTab("history")}
            className={currentTab === "history" ? "active" : ""}
            aria-label="History Tab"
          >
            <FaHistory /> History
          </button>
          <button
            onClick={() => setCurrentTab("all")}
            className={currentTab === "all" ? "active" : ""}
            aria-label="All Workouts Tab"
          >
            <FaListUl /> All Workouts
          </button>
        </nav>

        <main className="main" style={animStyle}>
          {currentTab === "today" && (
            <>
              <h2>{today}'s Workout</h2>
              {(workoutsData[today] || []).length === 0 && (
                <p>No workouts planned for today.</p>
              )}
              {(workoutsData[today] || []).map((exercise) => {
                const done = completions[today]?.[exercise.id] || {};
                return (
                  <div
                    key={exercise.id}
                    className="card"
                    title={exercise.notes}
                  >
                    <div className="card-header">
                      <h3>{exercise.name}</h3>
                      {done.sets && done.reps ? (
                        <FaCheckCircle className="done-icon" />
                      ) : null}
                    </div>
                    <p className="notes">{exercise.notes}</p>

                    <label>
                      Sets:
                      <select
                        value={done.sets || ""}
                        onChange={(e) =>
                          handleMarkDone(
                            today,
                            exercise.id,
                            parseInt(e.target.value),
                            done.reps || exercise.reps[0]
                          )
                        }
                        className="select"
                      >
                        {[3, 4].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Reps:
                      <select
                        value={done.reps || ""}
                        onChange={(e) =>
                          handleMarkDone(
                            today,
                            exercise.id,
                            done.sets || exercise.sets,
                            parseInt(e.target.value)
                          )
                        }
                        className="select"
                      >
                        {exercise.reps.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                );
              })}
              <p className="calorie">
                Estimated Calories Burned Today: {calcCaloriesForDay(today)}
              </p>
            </>
          )}

          {currentTab === "history" && (
            <>
              <h2>Workout History</h2>
              {Object.keys(completions).length === 0 && (
                <p>You have no workout records yet.</p>
              )}
              {Object.entries(completions).map(([day, exercises]) => (
                <div key={day} className="history-card">
                  <h3>{day}</h3>
                  <ul>
                    {Object.entries(exercises).map(([exId, { sets, reps }]) => {
                      const ex = (workoutsData[day] || []).find(
                        (w) => w.id === parseInt(exId)
                      );
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
            </>
          )}

          {currentTab === "all" && (
            <>
              <h2>All Workouts</h2>
              {daysOfWeek.map((day) => (
                <div key={day} className="day-workout-section">
                  <h3>{day}</h3>
                  {(workoutsData[day] || []).length === 0 && (
                    <p>No workouts planned.</p>
                  )}
                  {(workoutsData[day] || []).map((exercise) => {
                    const done = completions[day]?.[exercise.id] || {};
                    return (
                      <div
                        key={exercise.id}
                        className="card smaller"
                        title={exercise.notes}
                      >
                        <div className="card-header">
                          <h4>{exercise.name}</h4>
                          {done.sets && done.reps ? (
                            <FaCheckCircle className="done-icon" />
                          ) : null}
                        </div>
                        <p className="notes">{exercise.notes}</p>
                        <p className="sets-reps">
                          Sets: {done.sets || "-"}, Reps: {done.reps || "-"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ))}
            </>
          )}
        </main>

        <footer className="footer">
          <small>© 2025 Workout Tracker by User</small>
        </footer>
      </div>

      {/* CSS styles */}
      <style jsx>{`
        :global(html, body) {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background-color: ${darkMode ? "#121212" : "#f0f4f8"};
          color: ${darkMode ? "#e4e6eb" : "#222"};
          transition: background-color 0.4s ease, color 0.4s ease;
          min-height: 100vh;
        }
        .container {
          max-width: 480px;
          margin: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: ${darkMode ? "#181818" : "#fff"};
          border-radius: 16px;
          box-shadow: ${darkMode
            ? "0 10px 25px rgba(0,0,0,0.7)"
            : "0 10px 25px rgba(0,0,0,0.1)"};
          transition: background-color 0.4s ease, box-shadow 0.4s ease;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid ${darkMode ? "#333" : "#ddd"};
        }
        h1 {
          margin: 0;
          font-weight: 700;
          font-size: 1.6rem;
          letter-spacing: 1px;
        }
        .dark-toggle {
          background: none;
          border: none;
          cursor: pointer;
          color: ${darkMode ? "#ffd700" : "#444"};
          transition: color 0.3s ease;
          border-radius: 50%;
          padding: 6px;
          font-size: 22px;
        }
        .dark-toggle:hover {
          color: ${darkMode ? "#fff" : "#000"};
        }
        .nav {
          display: flex;
          justify-content: space-around;
          margin: 16px 0;
          border-radius: 12px;
          background-color: ${darkMode ? "#222" : "#eee"};
          box-shadow: ${darkMode
            ? "inset 0 1px 3px rgba(255,255,255,0.1)"
            : "inset 0 1px 3px rgba(0,0,0,0.1)"};
        }
        .nav button {
          background: none;
          border: none;
          flex: 1;
          color: ${darkMode ? "#bbb" : "#444"};
          font-weight: 600;
          font-size: 1rem;
          padding: 12px 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border-radius: 12px;
          transition: all 0.3s ease;
          user-select: none;
        }
        .nav button:hover {
          background-color: ${darkMode ? "#333" : "#ddd"};
          color: ${darkMode ? "#fff" : "#000"};
        }
        .nav button.active {
          background-color: ${darkMode ? "#3182ce" : "#3182ce"};
          color: white;
          box-shadow: 0 4px 10px rgba(49, 130, 206, 0.7);
          transform: scale(1.05);
        }
        .main {
          flex-grow: 1;
          overflow-y: auto;
          padding-bottom: 16px;
        }
        .card {
          background-color: ${darkMode ? "#252525" : "#fafafa"};
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 16px;
          box-shadow: ${darkMode
            ? "0 4px 8px rgba(0,0,0,0.8)"
            : "0 4px 8px rgba(0,0,0,0.05)"};
          transition: box-shadow 0.3s ease;
          user-select: none;
        }
        .card.smaller {
          padding: 12px;
          font-size: 0.9rem;
        }
        .card:hover {
          box-shadow: ${darkMode
            ? "0 6px 14px rgba(49, 130, 206, 0.9)"
            : "0 6px 14px rgba(49, 130, 206, 0.15)"};
          transform: translateY(-3px);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        h2,
        h3,
        h4 {
          margin: 0 0 8px 0;
          font-weight: 600;
          color: ${darkMode ? "#bee3f8" : "#2c5282"};
        }
        .notes {
          font-size: 0.85rem;
          color: ${darkMode ? "#a0aec0" : "#555"};
          margin-bottom: 12px;
        }
        .select {
          margin-left: 8px;
          margin-right: 16px;
          padding: 6px 10px;
          font-size: 0.9rem;
          border-radius: 8px;
          border: 1.5px solid ${darkMode ? "#444" : "#ccc"};
          background-color: ${darkMode ? "#383838" : "#fff"};
          color: ${darkMode ? "#eee" : "#222"};
          cursor: pointer;
          transition: border-color 0.2s ease;
        }
        .select:hover,
        .select:focus {
          border-color: ${darkMode ? "#3182ce" : "#3182ce"};
          outline: none;
        }
        .calorie {
          font-weight: 700;
          text-align: center;
          margin-top: 8px;
          color: ${darkMode ? "#68d391" : "#2f855a"};
        }
        .history-card {
          border: 1.5px solid ${darkMode ? "#444" : "#ddd"};
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 18px;
          background-color: ${darkMode ? "#181818" : "#fafafa"};
          box-shadow: ${darkMode
            ? "0 4px 20px rgba(0,0,0,0.75)"
            : "0 4px 15px rgba(49, 130, 206, 0.1)"};
        }
        .sets-reps {
          font-style: italic;
          margin-top: 6px;
          color: ${darkMode ? "#bee3f8" : "#4a5568"};
        }
        .done-icon {
          color: #48bb78;
          font-size: 20px;
          filter: drop-shadow(0 0 3px #48bb78a0);
          transition: transform 0.3s ease;
        }
        .done-icon:hover {
          transform: scale(1.2);
          cursor: default;
        }
        .day-workout-section {
          margin-bottom: 24px;
        }
        footer.footer {
          text-align: center;
          font-size: 0.8rem;
          color: ${darkMode ? "#666" : "#aaa"};
          margin-top: auto;
          padding: 12px 0 6px 0;
          user-select: none;
        }
        @media (max-width: 480px) {
          .container {
            border-radius: 0;
            box-shadow: none;
          }
          .nav button {
            font-size: 0.85rem;
          }
          h1 {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
}
