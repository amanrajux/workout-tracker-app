import React, { useState, useEffect } from "react";
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

  const today = daysOfWeek[new Date().getDay()];

  // Sync dark mode class on the body element for global styles
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (darkMode) document.body.classList.add("dark");
      else document.body.classList.remove("dark");
      localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }
  }, [darkMode]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("workoutCompletions", JSON.stringify(completions));
    }
  }, [completions]);

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

  const completionForFilteredDate = filterDate ? completedWorkoutsForDate(filterDate) : completions;

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
                  type="button"
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
                  type="button"
                >
                  {opt}
                </button>
              ))}
              <button
                onClick={() => setSelectedReps(manualEntryLabel)}
                className={selectedReps === manualEntryLabel ? "selected" : ""}
                type="button"
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
                  aria-label="Manual reps input"
                />
              )}
            </div>
          </div>
        )}
        {interactive && (
          <button
            disabled={
              !markedDone &&
              (!selectedSets || (!selectedReps && selectedReps !== manualEntryLabel))
            }
            className={`mark-btn ${markedDone ? "undo" : ""}`}
            onClick={markDone}
            type="button"
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
            background: var(--card-bg);
            border-radius: 16px;
            padding: 14px;
            margin-bottom: 16px;
            box-shadow: var(--card-shadow);
            color: var(--text-color);
            transition: box-shadow 0.3s ease;
          }
          .card.done {
            background: var(--card-done-bg);
            box-shadow: var(--card-done-shadow);
            color: var(--card-done-text);
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
            background-color: var(--accent-color);
            color: white;
            cursor: pointer;
            font-weight: 600;
            transition: background-color 0.3s ease;
            user-select: none;
          }
          button.selected,
          button:hover:not(:disabled) {
            background-color: var(--accent-hover);
            color: white;
            box-shadow: 0 0 8px var(--accent-hover-shadow);
          }
          input {
            width: 70px;
            border-radius: 10px;
            border: 1.5px solid var(--accent-color);
            padding: 4px 8px;
            font-weight: 600;
            font-family: "Inter", sans-serif;
            color: var(--text-color);
            background: var(--input-bg);
          }
          .mark-btn {
            width: 100%;
            padding: 10px;
            border-radius: 20px;
            background-color: var(--accent-color);
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
            background-color: var(--accent-disabled);
            cursor: not-allowed;
            color: var(--accent-disabled-text);
          }
          .mark-btn.undo {
            background-color: var(--undo-color);
            color: var(--undo-text);
          }
          .done-icon {
            color: var(--accent-color);
            font-size: 22px;
            filter: drop-shadow(0 0 3px var(--accent-shadow));
          }
        `}</style>
      </div>
    );
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --accent-color: #256d5b;
          --accent-hover: #2ca785;
          --accent-hover-shadow: #2ca785cc;
          --accent-shadow: #256d5baa;
          --accent-disabled: #a1bfb3;
          --accent-disabled-text: #47585a;
          --undo-color: #cc4c4c;
          --undo-text: #f7dedf;

          /* Light mode colors */
          --bg-color: #f9fafb;
          --text-color: #2d3748;
          --card-bg: white;
          --card-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
          --card-done-bg: #e6f4ee;
          --card-done-shadow: 0 0 20px #256d5baa;
          --card-done-text: #256d5b;
          --input-bg: white;

          /* Dark mode colors */
          --dark-bg-color: #1a202c;
          --dark-text-color: #edf2f7;
          --dark-card-bg: #2d3748;
          --dark-card-shadow: 0 1px 10px rgba(0, 0, 0, 0.25);
          --dark-card-done-bg: #256d5b33;
          --dark-card-done-shadow: 0 0 20px #256d5baa;
          --dark-card-done-text: #e6f4ee;
          --dark-input-bg: #2d3748;
        }
        body {
          margin: 0;
          font-family: "Inter", system-ui, sans-serif;
          background-color: var(--bg-color);
          color: var(--text-color);
          transition: all 0.3s ease;
          padding-bottom: 60px; /* bottom nav height */
          overflow-x: hidden;
          min-height: 100vh;
        }
        body.dark {
          background-color: var(--dark-bg-color);
          color: var(--dark-text-color);
        }
        body.dark .card {
          background-color: var(--dark-card-bg);
          color: var(--dark-text-color);
          box-shadow: var(--dark-card-shadow);
        }
        body.dark .card.done {
          background-color: var(--dark-card-done-bg);
          color: var(--dark-card-done-text);
          box-shadow: var(--dark-card-done-shadow);
        }
        body.dark input {
          background-color: var(--dark-input-bg);
          color: var(--dark-text-color);
          border-color: var(--accent-color);
        }

        main {
          max-width: 480px;
          margin: 0 auto;
          padding: 20px 16px 80px 16px; /* bottom padding for nav */
        }
      `}</style>

      <div>
        <header className="app-header">
          <h1>Workout Tracker</h1>
          <div
            className="dark-toggle"
            onClick={() => setDarkMode(!darkMode)}
            role="button"
            aria-label="Toggle dark mode"
            tabIndex="0"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setDarkMode(!darkMode);
            }}
          >
            {darkMode ? <FaSun size={22} /> : <FaMoon size={22} />}
          </div>
        </header>

        <nav className="bottom-nav" role="tablist">
          <button
            className={currentTab === "today" ? "active" : ""}
            onClick={() => setCurrentTab("today")}
            role="tab"
            aria-selected={currentTab === "today"}
          >
            <FaDumbbell size={18} />
            <span>Today</span>
          </button>
          <button
            className={currentTab === "history" ? "active" : ""}
            onClick={() => setCurrentTab("history")}
            role="tab"
            aria-selected={currentTab === "history"}
          >
            <FaHistory size={18} />
            <span>History</span>
          </button>
          <button
            className={currentTab === "all" ? "active" : ""}
            onClick={() => setCurrentTab("all")}
            role="tab"
            aria-selected={currentTab === "all"}
          >
            <FaListUl size={18} />
            <span>All Workouts</span>
          </button>
        </nav>

        <main>
          {currentTab === "today" && (
            <>
              <h2>{today}'s Workout</h2>
              {(workoutsData[today] || []).length === 0 && <p>No workouts today.</p>}
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
          .app-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 16px 10px 16px;
            user-select: none;
            background-color: transparent;
          }
          .dark-toggle {
            cursor: pointer;
            color: var(--accent-color);
            font-weight: 600;
            display: flex;
            align-items: center;
            user-select: none;
          }
          .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            max-width: 480px;
            background-color: var(--nav-bg);
            display: flex;
            border-top: 1px solid var(--nav-border);
            box-shadow: var(--nav-shadow);
            z-index: 1000;
          }
          .bottom-nav button {
            flex: 1;
            padding: 10px 0;
            background: none;
            border: none;
            color: var(--nav-text);
            font-weight: 700;
            font-size: 0.9rem;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            user-select: none;
            transition: color 0.3s ease;
          }
          .bottom-nav button span {
            font-size: 0.7rem;
          }
          .bottom-nav button.active {
            color: var(--accent-color);
          }
          .bottom-nav button:hover:not(.active) {
            color: var(--accent-hover);
          }
          main {
            max-width: 480px;
            margin: 0 auto;
            padding: 20px 16px 70px 16px; /* bottom padding for nav */
          }
          /* Colors and vars for light/dark mode */
          :global(:root) {
            --accent-color: #256d5b;
            --accent-hover: #2ca785;
            --nav-bg: #fff;
            --nav-border: #ddd;
            --nav-text: #256d5b;
            --nav-shadow: 0 -2px 6px rgba(0, 0, 0, 0.03);
          }
          :global(body.dark) {
            --nav-bg: #1a202c;
            --nav-border: #2d3748;
            --nav-text: #95e0c4;
            --nav-shadow: 0 -2px 12px rgba(0, 0, 0, 0.5);
          }
          .readonly-card {
            pointer-events: none;
            background-color: var(--readonly-bg);
            border-radius: 16px;
            padding: 14px 16px;
            margin-bottom: 18px;
            user-select: none;
          }
          :global(body) {
            --readonly-bg: #f3faf6;
            background-color: #f9fafb;
            color: #2d3748;
          }
          :global(body.dark) {
            --readonly-bg: #1f3530;
            background-color: #1a202c;
            color: #edf2f7;
          }
        `}</style>
      </div>
    </>
  );
}

