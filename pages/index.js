import React, { useState, useEffect } from "react";
import {
  FaDumbbell,
  FaHistory,
  FaListUl,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaUndoAlt,
} from "react-icons/fa";

const workouts = {
  Monday: [
    { id: 1, name: "Chest Press Machine", sets: 4, reps: [8, 10, 12], notes: "Primary Compound Lift" },
    { id: 2, name: "Shoulder Press Machine", sets: 3, reps: [8, 10, 12], notes: "Controlled descent" },
    { id: 3, name: "Pec Fly Machine", sets: 3, reps: [12, 15], notes: "Focus on squeeze" },
    { id: 4, name: "Lateral Raise Machine", sets: 3, reps: [12, 15], notes: "Strict, slow movement" },
    { id: 5, name: "Triceps Extension Machine", sets: 3, reps: [12, 15], notes: "Full contraction" },
    { id: 6, name: "Abdominal Machine", sets: 3, reps: [15, 20], notes: "Slow, controlled crunch" },
  ],
  Tuesday: [
    { id: 7, name: "Seated Leg Press", sets: 4, reps: [10, 12], notes: "Primary Compound Lift, full range" },
    { id: 8, name: "Leg Extension Machine", sets: 3, reps: [12, 15], notes: "Squeeze at the top" },
    { id: 9, name: "Seated Leg Curl", sets: 3, reps: [12, 15], notes: "Focus on negative motion" },
    { id: 10, name: "Hip Adduction Machine", sets: 3, reps: [15, 20], notes: "Squeeze glutes" },
    { id: 11, name: "Glute Extension Machine", sets: 3, reps: [12, 15], notes: "Peak contraction" },
    { id: 12, name: "Calf Extension Machine", sets: 3, reps: [15, 20], notes: "Full range calf workout" },
  ],
  Wednesday: [
    { id: 20, name: "Active Rest & Stretching", sets: 1, reps: ["30-45 min lightweight"], notes: "Light mobility" },
  ],
  Thursday: [
    { id: 21, name: "Lat Pulldown", sets: 4, reps: [8, 10, 12], notes: "Back engagement" },
    { id: 22, name: "Seated Row", sets: 3, reps: [8, 10, 12], notes: "Back strength" },
    { id: 23, name: "Assist Dip/Chin", sets: 3, reps: [8, 10], notes: "Assisted body weight" },
    { id: 24, name: "Rear Delt Machine", sets: 3, reps: [12, 15], notes: "Rear delt focus" },
    { id: 25, name: "Bicep Curl", sets: 3, reps: [12, 15], notes: "Isolated curls" },
    { id: 26, name: "Back Extension", sets: 3, reps: [12, 15], notes: "Lower back core" },
  ],
  Friday: [
    { id: 27, name: "Seated Leg Curl", sets: 4, reps: [10, 12], notes: "Hamstrings focus" },
    { id: 28, name: "Inclined Leg Press", sets: 3, reps: [10, 12], notes: "Quad and glute" },
    { id: 29, name: "Super Squats", sets: 3, reps: [10, 12], notes: "Higher rep quads" },
    { id: 30, name: "Leg Raises", sets: 3, reps: [15, 20], notes: "Core build" },
    { id: 31, name: "Russian Twist", sets: 3, reps: ["15/side"], notes: "Obliques" },
    { id: 32, name: "Abdominal Machine", sets: 3, reps: [15, 20], notes: "Strong core" },
  ],
  Saturday: [
    { id: 33, name: "Elliptical Cardio", sets: 1, reps: ["45 min moderate effort"], notes: "Cardio session" },
    { id: 34, name: "Stretch & Foam Roll", sets: 1, reps: ["10 min"], notes: "Post workout mobility" },
  ],
  Sunday: [
    { id: 35, name: "Rest Day", sets: 0, reps: [], notes: "Full rest and recovery" },
  ],
};

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const setsOptions = [3, 4];
const repsOptions = [8, 10, 12];
const manualLabel = "Manual";

export default function Home() {
  const [tab, setTab] = useState("today");
  const [completions, setCompletions] = useState(() => {
    if (typeof window !== "undefined") {
      const fromStorage = localStorage.getItem("workoutCompletions");
      return fromStorage ? JSON.parse(fromStorage) : {};
    }
    return {};
  });
  const [filterDate, setFilterDate] = useState("");
  const [expandedDays, setExpandedDays] = useState({});

  // Current day name for Today tab
  const todayName = daysOfWeek[new Date().getDay()];

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Enforce dark mode class for styling
      document.body.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("workoutCompletions", JSON.stringify(completions));
    }
  }, [completions]);

  function saveCompletion(day, id, data) {
    setCompletions((prev) => {
      const dayData = prev[day] ? { ...prev[day] } : {};
      if (data) dayData[id] = data;
      else delete dayData[id];
      return { ...prev, [day]: dayData };
    });
  }

  // Filter completions by date string "YYYY-MM-DD"
  function getCompletionsByDate(date) {
    if (!date) return completions;
    const filtered = {};
    Object.entries(completions).forEach(([day, exs]) => {
      Object.entries(exs).forEach(([id, val]) => {
        if (val.timestamp?.startsWith(date)) {
          if (!filtered[day]) filtered[day] = {};
          filtered[day][id] = val;
        }
      });
    });
    return filtered;
  }

  const filteredCompletions = getCompletionsByDate(filterDate);

  const toggleDay = (day) => {
    setExpandedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  // Workout card component
  const WorkoutCard = ({ exercise, day, interactive }) => {
    const saved = completions[day]?.[exercise.id] || {};
    const [sets, setSets] = useState(saved.sets || null);
    const [reps, setReps] = useState(saved.reps || null);
    const [manual, setManual] = useState(saved.manual || "");
    const [done, setDone] = useState(saved.done || false);

    useEffect(() => {
      setSets(saved.sets || null);
      setReps(saved.reps || null);
      setManual(saved.manual || "");
      setDone(saved.done || false);
    }, [saved]);

    function markDone() {
      if (!done && sets && (reps || reps === 0)) {
        saveCompletion(day, exercise.id, {
          done: true,
          sets,
          reps: reps === manualLabel ? manual : reps,
          manual: reps === manualLabel ? manual : null,
          timestamp: new Date().toISOString(),
        });
        setDone(true);
      } else {
        saveCompletion(day, exercise.id, null);
        setDone(false);
      }
    }

    return (
      <div className={`card${done ? " done" : ""}`}>
        <div className="card-header">
          <h4>{exercise.name}</h4>
          {done && <FaCheckCircle className="done-icon" />}
        </div>
        <p className="notes">{exercise.notes}</p>
        {interactive && !done && (
          <>
            <div className="selectors">
              <div className="sets">
                <span>Sets</span>
                {setsOptions.map((n) => (
                  <button key={n} className={sets === n ? "selected" : ""} onClick={() => setSets(n)}>
                    {n}
                  </button>
                ))}
              </div>
              <div className="reps">
                <span>Reps</span>
                {repsOptions.map((n) => (
                  <button key={n} className={reps === n ? "selected" : ""} onClick={() => setReps(n)}>
                    {n}
                  </button>
                ))}
                <button className={reps === manualLabel ? "selected" : ""} onClick={() => setReps(manualLabel)}>
                  {manualLabel}
                </button>
                {reps === manualLabel && (
                  <input type="number" min="1" placeholder="Reps" value={manual} onChange={(e) => setManual(e.target.value)} />
                )}
              </div>
            </div>
            <button className="mark-btn" disabled={!sets || (reps === null && reps !== 0)} onClick={markDone}>
              Mark Done
            </button>
          </>
        )}
        {interactive && done && (
          <button className="mark-btn undo" onClick={markDone}>
            Undo
          </button>
        )}

        <style jsx>{`
          .card {
            background: #161616;
            border-radius: 12px;
            box-shadow: 0 0 10px #000;
            padding: 12px;
            margin: 8px 0;
            color: #ccc;
          }
          .done {
            background: #264d26;
            color: #adebad;
            box-shadow: 0 0 12px #72dc72;
          }
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          h4 {
            margin: 0 0 6px 0;
          }
          .notes {
            font-style: italic;
            opacity: 0.7;
            margin-bottom: 10px;
          }
          .selectors {
            margin-bottom: 10px;
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
          }
          .sets,
          .reps {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          span {
            min-width: 40px;
            font-weight: 600;
            user-select: none;
          }
          button {
            padding: 5px 12px;
            border-radius: 8px;
            border: none;
            background: #3b7d3b;
            color: white;
            font-weight: 600;
            cursor: pointer;
            user-select: none;
            transition: background-color 0.3s ease;
          }
          button.selected,
          button:hover {
            background: #5ac85a;
            box-shadow: 0 0 10px #5ac85a;
          }
          button:disabled {
            background: #2b4b2b;
            cursor: not-allowed;
          }
          input[type="number"] {
            width: 60px;
            padding: 5px 8px;
            border-radius: 6px;
            border: 1px solid #51a351;
            background: #1f3d1f;
            color: #a7d9a7;
            font-weight: 600;
          }
          .mark-btn {
            width: 100%;
            padding: 12px 0;
            border-radius: 30px;
            background: #3c843c;
            font-weight: 700;
            font-size: 1.1rem;
            cursor: pointer;
            user-select: none;
          }
          .undo {
            background: #a93030;
          }
          .done-icon {
            font-size: 1.6rem;
            color: #90ee90;
            filter: drop-shadow(0 0 8px #32cd32);
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
          font-family: "Inter", sans-serif;
          background: #121212;
          color: #ccc;
          min-height: 100vh;
          overflow-x: hidden;
          padding-bottom: 72px;
        }
        main {
          max-width: 480px;
          margin: 0 auto;
          padding: 1rem;
        }
        header {
          text-align: center;
          font-weight: 900;
          font-size: 1.8rem;
          padding: 1rem;
          user-select: none;
          color: #7fbf7f;
        }
        .accordion {
          background: #222;
          border-radius: 14px;
          box-shadow: 0 0 10px #0008;
          margin-bottom: 20px;
          user-select: none;
        }
        .accordion-header {
          padding: 14px 20px;
          font-weight: 700;
          font-size: 1.1rem;
          color: #90d090;
          cursor: pointer;
          border-bottom: 1px solid #304030;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 14px 14px 0 0;
        }
        .accordion-content {
          padding: 0 20px;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        .accordion-content.expanded {
          max-height: 1000px;
          padding-top: 15px;
          padding-bottom: 20px;
        }
        nav.bottom-nav {
          position: fixed;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          background: #222;
          border-radius: 34px;
          padding: 10px 30px;
          display: flex;
          gap: 50px;
          box-shadow: 0 0 15px #222222;
          z-index: 100;
          user-select: none;
        }
        nav.bottom-nav button {
          background: none;
          border: none;
          color: #888;
          font-weight: 600;
          font-size: 0.85rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: color 0.25s ease;
          outline-offset: 3px;
        }
        nav.bottom-nav button:hover,
        nav.bottom-nav button:focus-visible {
          color: #7fff7f;
          outline: none;
        }
        nav.bottom-nav button.active {
          color: #7fff7f;
        }
        input[type="date"] {
          background: #1e3b1e;
          color: #a7e69a;
          border: none;
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 1rem;
          font-family: inherit;
          outline: none;
        }
        button:focus,
        input:focus {
          outline: 3px solid #7fff7f;
          outline-offset: 2px;
        }
      `}</style>

      <div>
        <header>Workout Tracker</header>

        <main>
          {tab === "today" && (
            <>
              <h2>Today's Workouts ({todayName})</h2>
              {workouts[todayName].map((ex) => (
                <WorkoutCard key={ex.id} exercise={ex} day={todayName} interactive />
              ))}
            </>
          )}

          {tab === "history" && (
            <>
              <h2>Workout History</h2>
              <label htmlFor="date-filter" style={{ marginBottom: 10, display: "block" }}>
                Filter by Date
                <input id="date-filter" type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
              </label>
              {filterDate && (
                <button
                  onClick={() => setFilterDate("")}
                  style={{
                    background: "#a93030",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 12px",
                    cursor: "pointer",
                    userSelect: "none",
                    marginBottom: 10,
                  }}
                >
                  Clear Filter
                </button>
              )}
              {Object.keys(filteredCompletions).length === 0 &&
                (filterDate ? (
                  <p>No workouts found for this date.</p>
                ) : (
                  <p>Select a date above to view your history.</p>
                ))}
              {Object.entries(filteredCompletions).map(([day, exs]) => (
                <div key={day} style={{ marginBottom: 20 }}>
                  <h3>{day}</h3>
                  <hr style={{ border: "0", borderTop: "1px solid #304030", marginBottom: 8 }} />
                  {Object.entries(exs).map(([id, val]) => {
                    const w = workouts[day]?.find(e => e.id === Number(id));
                    return (
                      <div key={id} className="card" style={{ marginBottom: 8 }}>
                        <strong>{w?.name || "Unknown"}</strong> - Sets: {val.sets}, Reps: {val.reps}
                      </div>
                    );
                  })}
                </div>
              ))}
            </>
          )}

          {tab === "all" && (
            <>
              <h2>All Workouts</h2>
              {daysOfWeek.map((day) => (
                <Accordion
                  key={day}
                  day={day}
                  expanded={!!expandedDays[day]}
                  onToggle={toggleDay}
                >
                  {(workouts[day] || []).map((ex) => (
                    <div key={ex.id} className="card" style={{ marginBottom: 12 }}>
                      <h4>{ex.name}</h4>
                      <p style={{ fontStyle: "italic", marginBottom: 8 }}>{ex.notes}</p>
                      <p>
                        Sets: {ex.sets} | Reps: {Array.isArray(ex.reps) ? ex.reps.join(", ") : ex.reps}
                      </p>
                    </div>
                  ))}
                </Accordion>
              ))}
            </>
          )}
        </main>

        <nav className="bottom-nav" role="tablist" aria-label="Navigation">
          <button onClick={() => setTab("today")} className={tab === "today" ? "active" : ""} aria-selected={tab === "today"} role="tab">
            <FaDumbbell />
            Today
          </button>
          <button onClick={() => setTab("history")} className={tab === "history" ? "active" : ""} aria-selected={tab === "history"} role="tab">
            <FaHistory />
            History
          </button>
          <button onClick={() => setTab("all")} className={tab === "all" ? "active" : ""} aria-selected={tab === "all"} role="tab">
            <FaListUl />
            All
          </button>
        </nav>
      </div>
    </>
  );
}

function Accordion({ day, expanded, onToggle, children }) {
  return (
    <section className="accordion">
      <header
        className="accordion-header"
        onClick={() => onToggle(day)}
        onKeyDown={e => e.key === "Enter" && onToggle(day)}
        tabIndex={0}
        role="button"
        aria-expanded={expanded}
      >
        <span>{day}</span>
        {expanded ? <FaChevronUp /> : <FaChevronDown />}
      </header>
      <div className={`accordion-content${expanded ? " expanded" : ""}`}>{children}</div>
      <style jsx>{`
        .accordion {
          background: #222;
          border-radius: 14px;
          box-shadow: 0 0 10px #000a;
          margin-bottom: 20px;
          user-select: none;
        }
        .accordion-header {
          padding: 14px 20px;
          font-weight: 700;
          font-size: 1.1rem;
          color: #90d090;
          cursor: pointer;
          border-bottom: 1px solid #304030;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 14px 14px 0 0;
        }
        .accordion-content {
          padding: 0 20px;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.3s ease;
        }
        .accordion-content.expanded {
          max-height: 1000px;
          padding-top: 15px;
          padding-bottom: 20px;
        }
      `}</style>
    </section>
  );
}
