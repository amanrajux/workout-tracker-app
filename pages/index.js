import { useState, useEffect } from "react";
import {
  FaDumbbell,
  FaHistory,
  FaListUl,
  FaCheckCircle,
  FaUndoAlt,
  FaSun,
  FaMoon,
} from "react-icons/fa";

const workoutsData = {
  Monday: [
    {
      id: 1,
      name: "Chest Press Machine",
      sets: 4,
      reps: [8, 10, 12],
      notes: "Primary Compound Lift",
      caloriesPerSet: 8,
    },
    {
      id: 2,
      name: "Shoulder Press Machine",
      sets: 3,
      reps: [8, 10, 12],
      notes: "Controlled descent",
      caloriesPerSet: 7,
    },
    {
      id: 3,
      name: "Pec Fly Machine",
      sets: 3,
      reps: [12, 15],
      notes: "Focus on squeeze",
      caloriesPerSet: 6,
    },
    {
      id: 4,
      name: "Lateral Raise Machine",
      sets: 3,
      reps: [12, 15],
      notes: "Strict, slow movement",
      caloriesPerSet: 5,
    },
    {
      id: 5,
      name: "Triceps Extension Machine",
      sets: 3,
      reps: [12, 15],
      notes: "Full contraction",
      caloriesPerSet: 5,
    },
    {
      id: 6,
      name: "Abdominal Machine",
      sets: 3,
      reps: [15, 20],
      notes: "Slow and controlled crunch",
      caloriesPerSet: 7,
    },
  ],
  Tuesday: [
    {
      id: 7,
      name: "Seated Leg Press",
      sets: 4,
      reps: [10, 12],
      notes: "Primary Compound Lift, full range",
      caloriesPerSet: 9,
    },
    {
      id: 8,
      name: "Leg Extension Machine",
      sets: 3,
      reps: [12, 15],
      notes: "Squeeze at the top",
      caloriesPerSet: 8,
    },
    {
      id: 9,
      name: "Seated Leg Curl Machine",
      sets: 3,
      reps: [12, 15],
      notes: "Focus on the negative",
      caloriesPerSet: 8,
    },
    {
      id: 10,
      name: "Hip Adduction Machine",
      sets: 3,
      reps: [15, 20],
      notes: "Squeeze glutes",
      caloriesPerSet: 6,
    },
    {
      id: 11,
      name: "Glute Extension Machine",
      sets: 3,
      reps: [12, 15],
      notes: "Peak contraction",
      caloriesPerSet: 7,
    },
    {
      id: 12,
      name: "Calf Extension Machine",
      sets: 3,
      reps: [15, 20],
      notes: "Full stretch and squeeze",
      caloriesPerSet: 5,
    },
  ],
  Wednesday: [
    {
      id: 20,
      name: "Active Rest / Stretching",
      sets: 1,
      reps: ["30-45 Min"],
      notes: "Light walk/mobility, optional light cardio",
      caloriesPerSet: 1,
    },
  ],
  Thursday: [
    {
      id: 21,
      name: "Lat Pulldown Machine",
      sets: 4,
      reps: [8, 10, 12],
      notes: "Pull with elbows, squeeze back",
      caloriesPerSet: 8,
    },
    {
      id: 22,
      name: "Seated Row Machine",
      sets: 3,
      reps: [8, 10, 12],
      notes: "Pull to lower abs",
      caloriesPerSet: 7,
    },
    {
      id: 23,
      name: "Assist Dip/Chin Machine",
      sets: 3,
      reps: [8, 10],
      notes: "Minimal assistance needed",
      caloriesPerSet: 7,
    },
    {
      id: 24,
      name: "Rear Delt Machine",
      sets: 3,
      reps: [12, 15],
      notes: "Reverse pec fly for rear delts",
      caloriesPerSet: 5,
    },
    {
      id: 25,
      name: "Bicep Curl Machine",
      sets: 3,
      reps: [12, 15],
      notes: "Controlled descent",
      caloriesPerSet: 5,
    },
    {
      id: 26,
      name: "Back Extension Machine",
      sets: 3,
      reps: [12, 15],
      notes: "Controlled lower back/core strength",
      caloriesPerSet: 6,
    },
  ],
  Friday: [
    {
      id: 27,
      name: "Seated Leg Curl Machine",
      sets: 4,
      reps: [10, 12],
      notes: "Heavy focus on hamstrings",
      caloriesPerSet: 9,
    },
    {
      id: 28,
      name: "Inclined Leg Press",
      sets: 3,
      reps: [10, 12],
      notes: "Feet higher for glute/ham emphasis",
      caloriesPerSet: 8,
    },
    {
      id: 29,
      name: "Super Squats Machine",
      sets: 3,
      reps: [10, 12],
      notes: "High rep quad/glute work",
      caloriesPerSet: 8,
    },
    {
      id: 30,
      name: "Leg Raises (Captain's Chair)",
      sets: 3,
      reps: [15, 20],
      notes: "Supported vertical leg raises",
      caloriesPerSet: 6,
    },
    {
      id: 31,
      name: "Russian Twist",
      sets: 3,
      reps: ["15/side"],
      notes: "Use dumbbell or plate",
      caloriesPerSet: 5,
    },
    {
      id: 32,
      name: "Abdominal Machine",
      sets: 3,
      reps: [15, 20],
      notes: "Heavier abdominal focus",
      caloriesPerSet: 7,
    },
  ],
  Saturday: [
    {
      id: 33,
      name: "Extended Cardio (Elliptical/Stairs/Treadmill)",
      sets: 1,
      reps: ["45-50 Min"],
      notes: "Steady state high calorie burn",
      caloriesPerSet: 130,
    },
    {
      id: 34,
      name: "Stretching / Foam Rolling",
      sets: 1,
      reps: ["10-15 Min"],
      notes: "Dedicated mobility work",
      caloriesPerSet: 1,
    },
  ],
  Sunday: [
    {
      id: 35,
      name: "Full Rest",
      sets: 0,
      reps: [],
      notes: "Prioritize sleep and nutrition",
      caloriesPerSet: 0,
    },
  ],
};

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

const setsOptions = [3, 4];
const repsOptions = [8, 10, 12];
const manualEntryLabel = "Manual Entry";

export default function Home() {
  const [currentTab, setCurrentTab] = useState("today");
  const [completions, setCompletions] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("workoutCompletions");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [filterDate, setFilterDate] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const today = getToday();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("workoutCompletions", JSON.stringify(completions));
    }
  }, [completions]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }
  }, [darkMode]);

  function saveCompletion(day, exerciseId, data) {
    setCompletions((prev) => {
      const dayData = prev[day] || {};
      if (data === null) {
        delete dayData[exerciseId];
      } else {
        dayData[exerciseId] = data;
      }
      return { ...prev, [day]: dayData };
    });
  }

  function completedWorkoutsForDate(date) {
    if (!date) return {};
    return Object.entries(completions).reduce((res, [day, exs]) => {
      Object.entries(exs).forEach(([exId, val]) => {
        if (val.timestamp && val.timestamp.startsWith(date)) {
          if (!res[day]) res[day] = {};
          res[day][exId] = val;
        }
      });
      return res;
    }, {});
  }

  const completionForFilteredDate = filterDate
    ? completedWorkoutsForDate(filterDate)
    : completions;

  const WorkoutCard = ({ day, exercise, interactive }) => {
    const saved = completions[day]?.[exercise.id];
    const [selectedSets, setSelectedSets] = useState(saved?.sets || null);
    const [selectedReps, setSelectedReps] = useState(saved?.reps || null);
    const [manualReps, setManualReps] = useState(saved?.manualReps || "");
    const [markedDone, setMarkedDone] = useState(!!saved?.done);

    useEffect(() => {
      setSelectedSets(saved?.sets || null);
      setSelectedReps(saved?.reps || null);
      setManualReps(saved?.manualReps || "");
      setMarkedDone(!!saved?.done);
    }, [saved]);

    function markDone() {
      if (!markedDone && selectedSets && (selectedReps || selectedReps === 0)) {
        saveCompletion(day, exercise.id, {
          done: true,
          sets: selectedSets,
          reps: selectedReps === manualEntryLabel ? manualReps : selectedReps,
          manualReps: selectedReps === manualEntryLabel ? manualReps : null,
          timestamp: new Date().toISOString(),
        });
        setMarkedDone(true);
      } else {
        saveCompletion(day, exercise.id, null);
        setMarkedDone(false);
      }
    }

    return (
      <div className={`card ${markedDone ? "done" : ""}`}>
        <div className="card-header">
          <h3>{exercise.name}</h3>
          {markedDone && <FaCheckCircle className="done-icon" />}
        </div>
        <p className="notes">{exercise.notes}</p>
        {interactive && !markedDone && (
          <div className="select-group">
            <div className="sets-group">
              <span>Sets:</span>
              {setsOptions.map((opt) => (
                <button
                  key={opt}
                  className={selectedSets === opt ? "selected" : ""}
                  onClick={() => setSelectedSets(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="reps-group">
              <span>Reps:</span>
              {repsOptions.map((opt) => (
                <button
                  key={opt}
                  className={selectedReps === opt ? "selected" : ""}
                  onClick={() => setSelectedReps(opt)}
                >
                  {opt}
                </button>
              ))}
              <button
                onClick={() => setSelectedReps(manualEntryLabel)}
                className={selectedReps === manualEntryLabel ? "selected" : ""}
              >
                {manualEntryLabel}
              </button>
              {selectedReps === manualEntryLabel && (
                <input
                  type="number"
                  min="1"
                  placeholder="Enter reps"
                  value={manualReps}
                  onChange={(e) => setManualReps(e.target.value)}
                />
              )}
            </div>
          </div>
        )}
        {interactive && (
          <button
            disabled={
              !markedDone &&
              (!selectedSets ||
                (!selectedReps && selectedReps !== manualEntryLabel))
            }
            className={`mark-btn ${markedDone ? "undo" : ""}`}
            onClick={markDone}
          >
            {markedDone ? (
              <>
                <FaUndoAlt /> Undo
              </>
            ) : (
              <>
                <FaCheckCircle /> Mark Done
              </>
            )}
          </button>
        )}

        <style jsx>{`
          .card {
            background: ${darkMode ? "#f9f9f9" : "white"};
            border-radius: 16px;
            padding: 14px;
            margin-bottom: 16px;
            box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
            color: ${darkMode ? "#2d3748" : "#1a202c"};
            transition: box-shadow 0.3s ease;
          }
          .card.done {
            background: ${darkMode ? "#256d5b33" : "#e6f4ee"};
            box-shadow: 0 0 20px #256d5baa;
          }
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          h3 {
            margin: 0 0 8px 0;
          }
          .notes {
            font-style: italic;
            margin-bottom: 10px;
            opacity: 0.8;
          }
          .select-group {
            display: flex;
            gap: 12px;
            margin-bottom: 14px;
            flex-wrap: wrap;
          }
          .sets-group,
          .reps-group {
            display: flex;
            align-items: center;
            gap: 6px;
          }
          span {
            font-weight: 700;
          }
          button {
            border: none;
            padding: 8px 14px;
            border-radius: 12px;
            background-color: #256d5b;
            color: white;
            cursor: pointer;
            font-weight: 600;
            transition: background-color 0.3s ease;
            user-select: none;
          }
          button.selected,
          button:hover:not(:disabled) {
            background-color: #2ca785;
            color: white;
            box-shadow: 0 0 8px #2ca785cc;
          }
          input {
            width: 70px;
            border-radius: 10px;
            border: 1.5px solid #2ca785;
            padding: 4px 8px;
            font-weight: 600;
            font-family: "Inter", sans-serif;
          }
          .mark-btn {
            width: 100%;
            padding: 10px;
            border-radius: 20px;
            background-color: #256d5b;
            color: white;
            font-weight: 700;
            font-size: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            user-select: none;
            transition: background-color 0.3s ease;
          }
          .mark-btn[disabled] {
            background-color: #a1bfb3;
            cursor: not-allowed;
            color: #47585a;
          }
          .mark-btn.undo {
            background-color: #cc4c4c;
            color: #f7dedf;
          }
          .done-icon {
            color: #256d5b;
            font-size: 22px;
            filter: drop-shadow(0 0 3px #256d5b88);
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className={darkMode ? "dark" : "light"}>
      <header className="app-header">
        <h1>Workout Tracker</h1>
        <div className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun size={22} /> : <FaMoon size={22} />}
        </div>
      </header>

      <nav>
        <button
          className={currentTab === "today" ? "active" : ""}
          onClick={() => setCurrentTab("today")}
        >
          <FaDumbbell /> Today
        </button>
        <button
          className={currentTab === "history" ? "active" : ""}
          onClick={() => setCurrentTab("history")}
        >
          <FaHistory /> History
        </button>
        <button
          className={currentTab === "all" ? "active" : ""}
          onClick={() => setCurrentTab("all")}
        >
          <FaListUl /> All Workouts
        </button>
      </nav>

      <main>
        {currentTab === "today" && (
          <>
            <h2>{today}'s Workout</h2>
            {(workoutsData[today] || []).length === 0 && (
              <p>No workouts today.</p>
            )}
            {(workoutsData[today] || []).map((exercise) => (
              <WorkoutCard
                key={exercise.id}
                day={today}
                exercise={exercise}
                interactive
              />
            ))}
          </>
        )}

        {currentTab === "history" && (
          <>
            <h2>Workout History</h2>
            <div className="filter-date">
              <label htmlFor="filter-date">Filter by Date: </label>
              <input
                type="date"
                id="filter-date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
              {filterDate && (
                <button onClick={() => setFilterDate("")}>Clear</button>
              )}
            </div>
            {!filterDate && Object.keys(completions).length === 0 && (
              <p>No workout records yet.</p>
            )}
            {filterDate ? (
              Object.entries(completionForFilteredDate).map(([day, exercises]) => (
                <div className="history-day" key={day}>
                  <h3>{day}</h3>
                  <ul>
                    {Object.entries(exercises).map(([exId, val]) => {
                      const ex = (workoutsData[day] || []).find(
                        (w) => w.id === parseInt(exId)
                      );
                      if (!ex) return null;
                      return (
                        <li key={exId}>
                          {ex.name} - Sets: {val.sets}, Reps: {val.reps}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            ) : (
              <p>Select a date to see completed workouts.</p>
            )}
          </>
        )}

        {currentTab === "all" && (
          <>
            <h2>All Workouts</h2>
            {daysOfWeek.map((day) => (
              <section key={day}>
                <h3>{day}</h3>
                {(workoutsData[day] || []).length === 0 && <p>No workouts planned.</p>}
                {(workoutsData[day] || []).map((exercise) => (
                  <div key={exercise.id} className="card readonly-card">
                    <div className="card-header">
                      <h3>{exercise.name}</h3>
                    </div>
                    <p className="notes">{exercise.notes}</p>
                    <p>
                      Sets: {exercise.sets} &nbsp;|&nbsp; Reps:{" "}
                      {Array.isArray(exercise.reps) ? exercise.reps.join(", ") : exercise.reps}
                    </p>
                  </div>
                ))}
              </section>
            ))}
          </>
        )}
      </main>

      <style jsx>{`
        :global(body) {
          margin: 0;
          font-family: "Inter", system-ui, sans-serif;
          background-color: #f9fafb;
          color: #2d3748;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .dark :global(body) {
          background-color: #1a202c;
          color: #edf2f7;
        }
        .container {
          max-width: 480px;
          margin: 0 auto;
        }
        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 16px 10px 16px;
          background: transparent;
        }
        .dark-toggle {
          cursor: pointer;
          color: #256d5b;
          font-weight: 600;
          user-select: none;
        }
        nav {
          display: flex;
          justify-content: space-around;
          padding: 0 10px 15px 10px;
          margin-bottom: 10px;
        }
        nav button {
          background: none;
          border: none;
          font-weight: 700;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 12px;
          transition: background-color 0.3s, color 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #256d5b;
          user-select: none;
          font-size: 1rem;
        }
        nav button.active {
          background-color: #256d5b;
          color: white;
          box-shadow: 0 4px 20px #256d5ba6;
          transform: scale(1.05);
        }
        nav button:hover:not(.active) {
          background-color: #d2e7df;
        }
        .dark nav button {
          color: #95e0c4;
        }
        .dark nav button:hover:not(.active) {
          background-color: #2f4f3f;
        }
        main {
          max-width: 480px;
          margin: 0 auto;
          padding: 0 16px 40px 16px;
        }
        main h2 {
          font-weight: 800;
          margin-bottom: 18px;
          border-bottom: 2px solid #256d5b66;
          padding-bottom: 6px;
          user-select: none;
        }
        .filter-date {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          font-weight: 600;
          user-select: none;
        }
        .filter-date input[type="date"] {
          padding: 6px 10px;
          border-radius: 12px;
          border: 1.5px solid #256d5b;
          font-size: 1rem;
          font-family: "Inter", system-ui, sans-serif;
          color: #2d3748;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .dark .filter-date input[type="date"] {
          background: #2d3748;
          color: #eee;
          border-color: #95e0c4;
        }
        .filter-date button {
          background-color: #cc4c4c;
          border: none;
          color: #f7dedf;
          padding: 6px 12px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .filter-date button:hover {
          background-color: #aa3b3b;
        }
        .history-day ul {
          padding-left: 22px;
          margin-top: 10px;
          font-style: italic;
          color: #49695b;
        }
        .dark .history-day ul {
          color: #aad3bb;
        }
        .card {
          background-color: white;
          border-radius: 16px;
          padding: 14px 16px;
          margin-bottom: 18px;
          box-shadow: 0 1px 6px rgb(0 0 0 / 0.12);
          color: #2d3748;
          transition: box-shadow 0.3s ease;
          user-select: none;
        }
        .dark .card {
          background-color: #2d3748;
          color: #edf2f7;
          box-shadow: 0 1px 10px rgb(0 0 0 / 0.25);
        }
        .card.done {
          background: #e6f4ee;
          box-shadow: 0 0 20px #256d5baa;
          color: #256d5b;
        }
        .dark .card.done {
          background: #256d5b33;
          box-shadow: 0 0 20px #256d5baa;
          color: #e6f4ee;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .notes {
          font-style: italic;
          margin-bottom: 10px;
          opacity: 0.8;
        }
        .select-group {
          display: flex;
          gap: 14px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .sets-group,
        .reps-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        span {
          font-weight: 700;
        }
        button {
          border: none;
          padding: 8px 16px;
          border-radius: 14px;
          background-color: #256d5b;
          color: white;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }
        button.selected,
        button:hover:not(:disabled) {
          background-color: #2ca785;
          box-shadow: 0 0 12px #2ca785cc;
          color: white;
        }
        button:disabled {
          background-color: #9bbba8;
          cursor: not-allowed;
          color: #d3f0e4;
        }
        input {
          width: 70px;
          border-radius: 14px;
          border: 1.5px solid #2ca785;
          padding: 6px 8px;
          font-weight: 600;
          font-family: "Inter", sans-serif;
          color: #2d3748;
        }
        .mark-btn {
          width: 100%;
          padding: 14px 0;
          border-radius: 24px;
          background-color: #256d5b;
          font-weight: 800;
          font-size: 1.1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          user-select: none;
          transition: background-color 0.3s ease;
        }
        .mark-btn.undo {
          background-color: #cc4c4c;
        }
        .done-icon {
          color: #256d5b;
          font-size: 24px;
          filter: drop-shadow(0 0 3px #256d5baa);
        }
        .readonly-card {
          pointer-events: none;
          background-color: #f3faf6;
        }
        .dark .readonly-card {
          background-color: #1f3530;
        }
      `}</style>
    </div>
  );
}
