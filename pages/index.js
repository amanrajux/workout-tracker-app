import React, { useState, useEffect } from "react";
import {
  FaDumbbell,
  FaHistory,
  FaListUl,
  FaCheckCircle,
  FaUndoAlt,
} from "react-icons/fa";

const workoutsData = {
  Monday: [
    { id: 1, name: "Chest Press Machine", sets: 4, reps: [8, 10, 12], notes: "Primary Compound Lift" },
    { id: 2, name: "Shoulder Press Machine", sets: 3, reps: [8, 10, 12], notes: "Controlled descent" },
    { id: 3, name: "Pec Fly Machine", sets: 3, reps: [12, 15], notes: "Focus on squeeze" },
    { id: 4, name: "Lateral Raise Machine", sets: 3, reps: [12, 15], notes: "Strict, slow movement" },
    { id: 5, name: "Triceps Extension Machine", sets: 3, reps: [12, 15], notes: "Full contraction" },
    { id: 6, name: "Abdominal Machine", sets: 3, reps: [15, 20], notes: "Slow and controlled crunch" },
  ],
  Tuesday: [
    { id: 7, name: "Seated Leg Press", sets: 4, reps: [10, 12], notes: "Primary Compound Lift, full range" },
    { id: 8, name: "Leg Extension Machine", sets: 3, reps: [12, 15], notes: "Squeeze at the top" },
    { id: 9, name: "Seated Leg Curl Machine", sets: 3, reps: [12, 15], notes: "Focus on the negative" },
    { id: 10, name: "Hip Adduction Machine", sets: 3, reps: [15, 20], notes: "Squeeze glutes" },
    { id: 11, name: "Glute Extension Machine", sets: 3, reps: [12, 15], notes: "Peak contraction" },
    { id: 12, name: "Calf Extension Machine", sets: 3, reps: [15, 20], notes: "Full stretch and squeeze" },
  ],
  Wednesday: [
    { id: 20, name: "Active Rest / Stretching", sets: 1, reps: ["30-45 Min"], notes: "Light walk/mobility, optional light cardio" },
  ],
  Thursday: [
    { id: 21, name: "Lat Pulldown Machine", sets: 4, reps: [8, 10, 12], notes: "Pull with elbows, squeeze back" },
    { id: 22, name: "Seated Row Machine", sets: 3, reps: [8, 10, 12], notes: "Pull to lower abs" },
    { id: 23, name: "Assist Dip/Chin Machine", sets: 3, reps: [8, 10], notes: "Minimal assistance needed" },
    { id: 24, name: "Rear Delt Machine", sets: 3, reps: [12, 15], notes: "Reverse pec fly for rear delts" },
    { id: 25, name: "Bicep Curl Machine", sets: 3, reps: [12, 15], notes: "Controlled descent" },
    { id: 26, name: "Back Extension Machine", sets: 3, reps: [12, 15], notes: "Controlled lower back/core strength" },
  ],
  Friday: [
    { id: 27, name: "Seated Leg Curl Machine", sets: 4, reps: [10, 12], notes: "Heavy focus on hamstrings" },
    { id: 28, name: "Inclined Leg Press", sets: 3, reps: [10, 12], notes: "Feet higher for glute/ham emphasis" },
    { id: 29, name: "Super Squats Machine", sets: 3, reps: [10, 12], notes: "High rep quad/glute work" },
    { id: 30, name: "Leg Raises (Captain's Chair)", sets: 3, reps: [15, 20], notes: "Supported vertical leg raises" },
    { id: 31, name: "Russian Twist", sets: 3, reps: ["15/side"], notes: "Use dumbbell or plate" },
    { id: 32, name: "Abdominal Machine", sets: 3, reps: [15, 20], notes: "Heavier abdominal focus" },
  ],
  Saturday: [
    { id: 33, name: "Extended Cardio (Elliptical/Stairs/Treadmill)", sets: 1, reps: ["45-50 Min"], notes: "Steady state high calorie burn" },
    { id: 34, name: "Stretching / Foam Rolling", sets: 1, reps: ["10-15 Min"], notes: "Dedicated mobility work" },
  ],
  Sunday: [
    { id: 35, name: "Full Rest", sets: 0, reps: [], notes: "Prioritize sleep and nutrition" },
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
      return JSON.parse(localStorage.getItem("workoutCompletions") || "{}");
    }
    return {};
  });
  const [filterDate, setFilterDate] = useState("");

  // Apply dark mode on body on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.classList.add("dark");
    }
  }, []);

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
    const filtered = {};
    Object.entries(completions).forEach(([day, exs]) => {
      Object.entries(exs).forEach(([exId, val]) => {
        if (val.timestamp && val.timestamp.startsWith(date)) {
          if (!filtered[day]) filtered[day] = {};
          filtered[day][exId] = val;
        }
      });
    });
    return filtered;
  }

  const filteredCompletions = filterDate ? completedWorkoutsForDate(filterDate) : completions;
  const today = daysOfWeek[new Date().getDay()];

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
            background: #121212;
            color: #ddd;
            border-radius: 16px;
            padding: 16px;
            margin-bottom: 16px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7);
            transition: background-color 0.3s ease;
          }
          .card.done {
            background: #263529;
            box-shadow: 0 0 20px #3dcc79aa;
            color: #adebad;
          }
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          h3 {
            margin: 0 0 0.5rem 0;
            user-select: none;
          }
          .notes {
            font-style: italic;
            margin-bottom: 1rem;
            opacity: 0.7;
            user-select: none;
          }
          .select-group {
            display: flex;
            gap: 20px;
            margin-bottom: 1rem;
            flex-wrap: wrap;
          }
          .sets-group,
          .reps-group {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          span {
            font-weight: 600;
            min-width: 50px;
            user-select: none;
          }
          button {
            background-color: #256d5b;
            border: none;
            padding: 8px 14px;
            border-radius: 12px;
            color: #eee;
            font-weight: 600;
            cursor: pointer;
            user-select: none;
            transition: background-color 0.3s ease;
          }
          button.selected,
          button:hover:not(:disabled) {
            background-color: #2dbb7a;
            box-shadow: 0 0 10px #2dbb7aaa;
          }
          button:disabled {
            background-color: #1a432a;
            cursor: not-allowed;
            opacity: 0.7;
          }
          input {
            width: 70px;
            padding: 6px 8px;
            border-radius: 8px;
            border: 1.5px solid #2dbb7a;
            background-color: #233623;
            color: #adebad;
            font-weight: 600;
            font-family: "Inter", sans-serif;
          }
          .mark-btn {
            width: 100%;
            padding: 12px 0;
            border-radius: 30px;
            background-color: #256d5b;
            font-weight: 800;
            font-size: 1.1rem;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            user-select: none;
          }
          .mark-btn.undo {
            background-color: #b33932;
          }
          .done-icon {
            font-size: 1.6rem;
            color: #adebad;
            filter: drop-shadow(0 0 6px #adebadcc);
          }
        `}</style>
      </div>
    );
  };

  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          font-family: "Inter", sans-serif;
          background-color: #101210;
          color: #ccc;
          overflow-x: hidden;
          min-height: 100vh;
        }
        main {
          max-width: 480px;
          margin: 0 auto;
          padding: 1rem 1rem 66px; /* 66 height for bottom nav */
          box-sizing: border-box;
        }
        header {
          padding: 20px 15px 10px;
          text-align: center;
          font-weight: 900;
          font-size: 1.8rem;
          user-select: none;
          color: #a3d8a5;
        }
        nav.bottom-nav {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          background-color: #1a1a1a;
          display: flex;
          justify-content: center;
          gap: 3rem;
          padding: 0.8rem 1.5rem;
          border-radius: 20px 20px 0 0;
          box-shadow: 0 -2px 10px #0008;
          height: 60px;
          width: fit-content;
          user-select: none;
          z-index: 10;
        }
        nav.bottom-nav button {
          background: none;
          border: none;
          color: #829f84;
          font-weight: 700;
          font-size: 0.8rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          cursor: pointer;
          outline-offset: 2px;
          padding-top: 4px;
          transition: color 0.3s ease;
          width: 80px;
        }
        nav.bottom-nav button.active {
          color: #a3d8a5;
        }
        nav.bottom-nav button:hover:not(.active) {
          color: #a3d8a5;
        }
      `}</style>

      <div>
        <header>Workout Tracker</header>
        <main>
          {currentTab === "today" && (
            <>
              <h2>Today's Workouts ({daysOfWeek[new Date().getDay()]})</h2>
              {workoutsData[daysOfWeek[new Date().getDay()]].map((ex) => (
                <WorkoutCard key={ex.id} day={daysOfWeek[new Date().getDay()]} exercise={ex} interactive />
              ))}
            </>
          )}
          {currentTab === "history" && (
            <>
              <h2>Workout History</h2>
              <label>
                Filter date:{" "}
                <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
                {filterDate && (
                  <button style={{ marginLeft: "0.5rem", background: "#b33932", color: "#fff", borderRadius: "0.25rem" }} onClick={() => setFilterDate("")}>
                    Clear
                  </button>
                )}
              </label>
              {!filterDate && Object.keys(completions).length === 0 && <p>No workout history yet</p>}
              {filterDate ? (
                Object.entries(filteredCompletions).map(([day, exercises]) => (
                  <section key={day}>
                    <h3>{day}</h3>
                    <ul>
                      {Object.entries(exercises).map(([id, val]) => {
                        const w = workoutsData[day].find((e) => e.id == id);
                        return (
                          <li key={id}>
                            {w ? w.name : "Unknown Exercise"} - Sets: {val.sets}, Reps: {val.reps}
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))
              ) : (
                <p>Please select a date above to see completed workouts.</p>
              )}
            </>
          )}
          {currentTab === "all" && (
            <>
              <h2>All Workouts</h2>
              {daysOfWeek.map((day) => (
                <section key={day}>
                  <h3>{day}</h3>
                  {(workoutsData[day] || []).length === 0 ? (
                    <p>No workouts scheduled for this day.</p>
                  ) : (
                    workoutsData[day].map((ex) => (
                      <div key={ex.id} className="readonlyCard">
                        <h4>{ex.name}</h4>
                        <p>{ex.notes}</p>
                        <p>
                          Sets: {ex.sets} | Reps: {Array.isArray(ex.reps) ? ex.reps.join(", ") : ex.reps}
                        </p>
                      </div>
                    ))
                  )}
                </section>
              ))}
            </>
          )}
        </main>

        <nav className="bottom-nav" role="tablist" aria-label="Main navigation">
          <button aria-selected={currentTab === "today"} onClick={() => setCurrentTab("today")} role="tab" tabIndex={0}>
            <FaDumbbell size={24} />
            Today
          </button>
          <button aria-selected={currentTab === "history"} onClick={() => setCurrentTab("history")} role="tab" tabIndex={0}>
            <FaHistory size={24} />
            History
          </button>
          <button aria-selected={currentTab === "all"} onClick={() => setCurrentTab("all")} role="tab" tabIndex={0}>
            <FaListUl size={24} />
            All
          </button>
        </nav>
      </div>
    </>
  );
}
