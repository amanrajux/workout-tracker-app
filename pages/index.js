import React, { useState, useEffect, useRef } from "react";
import {
  FaDumbbell,
  FaHistory,
  FaListUl,
  FaChevronDown,
  FaChevronUp,
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
    { id: 20, name: "Active Rest & Stretching", reps: ["30-45 min lightweight"], notes: "Light mobility" },
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
    { id: 31, name: "Russian Twist", reps: ["15 per side"], notes: "Obliques" },
    { id: 32, name: "Abdominal Machine", sets: 3, reps: [15, 20], notes: "Strong core" },
  ],
  Saturday: [
    { id: 33, name: "Elliptical/Cardio", reps: ["45 min"], notes: "Cardio session" },
    { id: 34, name: "Stretch & Roll", reps: ["10 min"], notes: "Mobility" },
  ],
  Sunday: [
    { id: 35, name: "Rest", reps: [], notes: "Recovery day" },
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
      const stored = localStorage.getItem("workoutCompletions");
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });
  const [filterDate, setFilterDate] = useState("");
  const [expandedDays, setExpandedDays] = useState({});

  const today = daysOfWeek[new Date().getDay()];

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

  const toggleDay = day => setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }));

  function saveCompletion(day, id, data) {
    setCompletions(prev => {
      const dayData = { ...prev[day] };
      if (data) {
        dayData[id] = data;
      } else {
        delete dayData[id];
      }
      return { ...prev, [day]: dayData };
    });
  }

  function filterCompletionsByDate(date) {
    if (!date) return completions;
    const filtered = {};
    for (const [day, exs] of Object.entries(completions)) {
      for (const [id, val] of Object.entries(exs)) {
        if (val.timestamp && val.timestamp.startsWith(date)) {
          if (!filtered[day]) filtered[day] = {};
          filtered[day][id] = val;
        }
      }
    }
    return filtered;
  }

  const filteredCompletions = filterCompletionsByDate(filterDate);

  const WorkoutCard = ({ exercise, day, interactive }) => {
    const saved = completions[day]?.[exercise.id] || {};
    const [sets, setSets] = React.useState(saved.sets || null);
    const [reps, setReps] = React.useState(saved.reps || null);
    const [manualReps, setManualReps] = React.useState(saved.manual || "");
    const [marked, setMarked] = React.useState(saved.done || false);
    const manualRef = React.useRef(null);

    React.useEffect(() => {
      setSets(saved.sets || null);
      setReps(saved.reps || null);
      setManualReps(saved.manual || "");
      setMarked(saved.done || false);
    }, [saved]);

    React.useEffect(() => {
      if (reps === manualLabel && manualRef.current) manualRef.current.focus();
    }, [reps]);

    const toggleMark = () => {
      if (!marked && sets && (reps || reps === 0)) {
        saveCompletion(day, exercise.id, {
          sets,
          reps: reps === manualLabel ? manualReps : reps,
          manual: reps === manualLabel ? manualReps : null,
          done: true,
          timestamp: new Date().toISOString(),
        });
        setMarked(true);
      } else {
        saveCompletion(day, exercise.id, null);
        setMarked(false);
      }
    };

    return (
      <div className={`card${marked ? " done" : ""}`}>
        <div className="card-header">
          <h4>{exercise.name}</h4>
          {marked && <FaCheckCircle className="done-icon" />}
        </div>
        <p className="notes">{exercise.notes}</p>
        {interactive && !marked && (
          <>
            <div className="selectors">
              <div className="sets">
                <span>Sets</span>
                {setsOptions.map(n => (
                  <button key={n} className={sets === n ? "selected" : ""} onClick={() => setSets(n)}>
                    {n}
                  </button>
                ))}
              </div>
              <div className="reps">
                <span>Reps</span>
                {repsOptions.map(n => (
                  <button key={n} className={reps === n ? "selected" : ""} onClick={() => setReps(n)}>
                    {n}
                  </button>
                ))}
                <button className={reps === manualLabel ? "selected" : ""} onClick={() => setReps(manualLabel)}>
                  {manualLabel}
                </button>
                {reps === manualLabel && (
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter reps"
                    value={manualReps}
                    onChange={e => setManualReps(e.target.value)}
                    ref={manualRef}
                    aria-label="Manual reps input"
                  />
                )}
              </div>
            </div>
            <button
              className="mark-btn"
              disabled={!sets || (reps === null && reps !== 0)}
              onClick={toggleMark}
            >
              Mark Done
            </button>
          </>
        )}
        {interactive && marked && (
          <button className="mark-btn undo" onClick={toggleMark}>
            Undo
          </button>
        )}
        <style jsx>{`
          .card {
            background: #1a1a1a;
            border-radius: 12px;
            padding: 14px;
            margin-bottom: 12px;
            box-shadow: 0 5px 12px #000a;
            color: #ddd;
            transition: background-color 0.3s ease;
          }
          .done {
            background: #285328;
            color: #aadea8;
            box-shadow: 0 0 14px #40d640aa;
          }
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          h4 {
            margin: 0 0 8px 0;
          }
          .notes {
            margin-bottom: 12px;
            font-style: italic;
            opacity: 0.75;
          }
          .selectors {
            margin-bottom: 12px;
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
          }
          .sets, .reps {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          span {
            user-select: none;
            font-weight: 600;
            min-width: 40px;
          }
          button {
            cursor: pointer;
            font-weight: 600;
            border: none;
            padding: 6px 12px;
            border-radius: 10px;
            background-color: #3b713b;
            color: white;
            transition: background-color 0.3s ease;
            user-select: none;
          }
          button.selected, button:hover:not(:disabled) {
            background-color: #61c961;
            box-shadow: 0 0 12px #61c961aa;
          }
          button:disabled {
            background-color: #2a4a2a;
            opacity: 0.6;
            cursor: not-allowed;
          }
          input[type="number"] {
            padding: 6px 10px;
            font-weight: 600;
            font-family: "Inter", sans-serif;
            width: 60px;
            color: #aadea8;
            background-color: #254225;
            border: 1.5px solid #61c961;
            border-radius: 8px;
          }
          .mark-btn {
            width: 100%;
            padding: 12px;
            font-weight: 800;
            border-radius: 30px;
            background-color: #326c32;
          }
          .undo {
            background-color: #a82828;
          }
          .done-icon {
            color: #aadea8;
            font-size: 1.8rem;
            filter: drop-shadow(0 0 7px #40d640aa);
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
          background-color: #121212;
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
          font-size: 1.75rem;
          padding: 1rem 0;
          user-select: none;
          color: #7fbf7f;
        }
        nav.bottom-nav {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #222;
          border-radius: 35px;
          padding: 10px 35px;
          display: flex;
          gap: 60px;
          box-shadow: 0 0 15px #22222288;
          user-select: none;
          z-index: 999;
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
          outline-offset: 2px;
        }
        nav.bottom-nav button:hover,
        nav.bottom-nav button:focus-visible {
          color: #7fbf7f;
          outline: none;
        }
        nav.bottom-nav button.active {
          color: #7fbf7f;
        }
        input[type="date"] {
          cursor: pointer;
          padding: 8px 14px;
          margin-left: 8px;
          font-size: 1rem;
          border-radius: 7px;
          border: none;
          background-color: #233423;
          color: #aadea8;
        }
        button:focus,
        input:focus {
          outline: 3px solid #74c374;
          outline-offset: 2px;
        }
        .accordion {
          background: #222;
          border-radius: 15px;
          box-shadow: 0 0 14px #0007;
          margin-bottom: 20px;
          user-select: none;
        }
        .accordion-header {
          padding: 14px 20px;
          cursor: pointer;
          color: #87ba87;
          font-weight: 700;
          font-size: 1.2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #304030;
          border-radius: 15px 15px 0 0;
        }
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          padding: 0 20px;
        }
        .accordion-content.expanded {
          max-height: 5000px;
          padding: 15px 20px 20px;
        }
      `}</style>

      <div>
        <header>Workout Tracker</header>

        <main>
          {tab === "today" && (
            <>
              <h2>Today's Workouts ({today})</h2>
              {workoutsData[today].map(ex => (
                <WorkoutCard key={ex.id} exercise={ex} day={today} interactive />
              ))}
            </>
          )}

          {tab === "history" && (
            <>
              <h2>History</h2>
              <label htmlFor="filter-date">
                Filter Date
                <input id="filter-date" type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
              </label>
              {filterDate && (
                <button style={{ marginLeft: 8, backgroundColor: "#c03" }} onClick={() => setFilterDate("")}>
                  Clear
                </button>
              )}
              {Object.keys(filteredCompletions).length === 0 ? (
                <p style={{ marginTop: 15 }}>No workouts found for selected date.</p>
              ) : (
                Object.entries(filteredCompletions).map(([day, exs]) => (
                  <Accordion key={day} day={day} expanded={expandedDays[day]} onToggle={toggleDay}>
                    {Object.entries(exs).map(([id, val]) => {
                      const w = workoutsData[day]?.find(item => item.id === Number(id));
                      return (
                        <div key={id} className="card" style={{ marginBottom: 8 }}>
                          <strong>{w?.name ?? "Unknown Exercise"}</strong>: {val.sets} Sets, {val.reps} Reps
                        </div>
                      );
                    })}
                  </Accordion>
                ))
              )}
            </>
          )}

          {tab === "all" && (
            <>
              <h2>All Workouts</h2>
              {daysOfWeek.map(day => (
                <Accordion key={day} day={day} expanded={expandedDays[day]} onToggle={toggleDay}>
                  {(workoutsData[day] || []).map(ex => (
                    <div key={ex.id} className="card" style={{ marginBottom: 12 }}>
                      <h4>{ex.name}</h4>
                      <p style={{ fontStyle: "italic", marginBottom: 6 }}>{ex.notes}</p>
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

        <nav className="bottom-nav" role="tablist" aria-label="Navigation tabs">
          <button onClick={() => setTab("today")} className={tab === "today" ? "active" : ""} aria-selected={tab === "today"} role="tab" tabIndex={0}>
            <FaDumbbell /> Today
          </button>
          <button onClick={() => setTab("history")} className={tab === "history" ? "active" : ""} aria-selected={tab === "history"} role="tab" tabIndex={0}>
            <FaHistory /> History
          </button>
          <button onClick={() => setTab("all")} className={tab === "all" ? "active" : ""} aria-selected={tab === "all"} role="tab" tabIndex={0}>
            <FaListUl /> All
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
        onClick={() => onToggle(day)}
        onKeyDown={e => e.key === "Enter" && onToggle(day)}
        tabIndex={0}
        role="button"
        aria-expanded={expanded}
        className="accordion-header"
      >
        <span>{day}</span>
        {expanded ? <FaChevronUp /> : <FaChevronDown />}
      </header>
      <div className={`accordion-content${expanded ? " expanded" : ""}`}>
        {children}
      </div>
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
          cursor: pointer;
          color: #7fbf7f;
          font-weight: 700;
          font-size: 1.15rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #304030;
          border-radius: 14px 14px 0 0;
        }
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          padding: 0 20px;
        }
        .accordion-content.expanded {
          max-height: 5000px;
          padding: 15px 20px 20px;
        }
      `}</style>
    </section>
  );
}
