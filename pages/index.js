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
    { id: 6, name: "Abdominal Machine", sets: 3, reps: [15, 20], notes: "Slow and controlled crunch" },
  ],
  // ... Other days data (complete as per your data)
  Tuesday: [/*...*/],
  Wednesday: [/*...*/],
  Thursday: [/*...*/],
  Friday: [/*...*/],
  Saturday: [/*...*/],
  Sunday: [/*...*/],
};

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const setsOptions = [3, 4];
const repsOptions = [8, 10, 12];
const manualLabel = "Manual Entry";

export default function Home() {
  const [currentTab, setCurrentTab] = useState("today");
  const [completions, setCompletions] = useState(() => {
    if(typeof window !== "undefined") {
      const val = localStorage.getItem("workoutCompletions");
      return val ? JSON.parse(val) : {};
    }
    return {};
  });
  const [filterDate, setFilterDate] = useState("");
  const [expandedDays, setExpandedDays] = useState({});

  const today = daysOfWeek[new Date().getDay()];

  useEffect(() => {
    if(typeof window !== "undefined") document.body.classList.add("dark");
  }, []);

  useEffect(() => {
    if(typeof window !== "undefined") localStorage.setItem("workoutCompletions", JSON.stringify(completions));
  }, [completions]);

  function toggleDay(day) {
    setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }));
  }

  function saveCompletion(day, id, data) {
    setCompletions(prev => {
      const dayData = {...(prev[day] || {})};
      if (data) dayData[id] = data;
      else delete dayData[id];
      return {...prev, [day]: dayData};
    });
  }

  function getCompletionsByDate(date) {
    if(!date) return completions;
    const filtered = {};
    Object.entries(completions).forEach(([day, exs]) => {
      Object.entries(exs).forEach(([id, val]) => {
        if(val.timestamp && val.timestamp.startsWith(date)) {
          if(!filtered[day]) filtered[day] = {};
          filtered[day][id] = val;
        }
      });
    });
    return filtered;
  }

  const filteredCompletions = getCompletionsByDate(filterDate);

  const WorkoutCard = ({exercise, day, interactive}) => {
    const saved = completions[day]?.[exercise.id] || {};
    const [sets, setSets] = useState(saved.sets || null);
    const [reps, setReps] = useState(saved.reps || null);
    const [manualReps, setManualReps] = useState(saved.manual || "");
    const [markedDone, setMarkedDone] = useState(!!saved.done);
    const manualInputRef = useRef(null);

    useEffect(() => {
      setSets(saved.sets || null);
      setReps(saved.reps || null);
      setManualReps(saved.manual || "");
      setMarkedDone(!!saved.done);
    }, [saved]);

    useEffect(() => {
      if(reps === manualLabel && manualInputRef.current) {
        manualInputRef.current.focus();
      }
    }, [reps]);

    function markDone() {
      if (!markedDone && sets && (reps || reps === 0)) {
        saveCompletion(day, exercise.id, {
          done: true,
          sets,
          reps: reps === manualLabel ? manualReps : reps,
          manual: reps === manualLabel ? manualReps : null,
          timestamp: new Date().toISOString(),
        });
        setMarkedDone(true);
      } else {
        saveCompletion(day, exercise.id, null);
        setMarkedDone(false);
      }
    }

    return (
      <div className={`card${markedDone ? " done" : ""}`}>
        <div className="card-header">
          <h4>{exercise.name}</h4>
          {markedDone && <FaCheckCircle className="done-icon" />}
        </div>
        <p className="notes">{exercise.notes}</p>
        {interactive && !markedDone && (
          <>
            <div className="selectors">
              <div className="sets">
                <span>Sets:</span>
                {setsOptions.map(option => (
                  <button
                    key={option}
                    className={sets === option ? "selected" : ""}
                    onClick={() => setSets(option)}
                    type="button"
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="reps">
                <span>Reps:</span>
                {repsOptions.map(option => (
                  <button
                    key={option}
                    className={reps === option ? "selected" : ""}
                    onClick={() => setReps(option)}
                    type="button"
                  >
                    {option}
                  </button>
                ))}
                <button
                  className={reps === manualLabel ? "selected" : ""}
                  onClick={() => setReps(manualLabel)}
                  type="button"
                >
                  {manualLabel}
                </button>
                {reps === manualLabel && (
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter reps"
                    value={manualReps}
                    onChange={(e) => setManualReps(e.target.value)}
                    aria-label="Manual reps input"
                    ref={manualInputRef}
                  />
                )}
              </div>
            </div>
            <button
              disabled={!sets || (!reps && reps !== manualLabel)}
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
          </>
        )}
        {interactive && markedDone && (
          <button className="mark-btn undo" onClick={markDone} type="button">
            Undo
          </button>
        )}

        <style jsx>{`
          .card {
            background: #1a1a1a;
            color: #ddd;
            border-radius: 12px;
            padding: 14px;
            margin-bottom: 12px;
            box-shadow: 0 5px 12px #000a;
            transition: background-color 0.3s ease;
          }
          .done {
            background: #285328;
            color: #a8d6a8;
            box-shadow: 0 0 14px #40d540aa;
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
            font-style: italic;
            margin-bottom: 12px;
            opacity: 0.7;
          }
          .selectors {
            margin-bottom: 12px;
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
          }
          .sets,
          .reps {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          span {
            font-weight: 600;
            min-width: 40px;
            user-select: none;
          }
          button {
            background-color: #3b703b;
            border: none;
            padding: 6px 14px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            user-select: none;
            transition: background-color 0.3s ease;
          }
          button.selected,
          button:hover:not(:disabled) {
            background-color: #61c061;
            box-shadow: 0 0 12px #61c061aa;
          }
          button:disabled {
            background-color: #286528;
            cursor: not-allowed;
          }
          input[type="number"] {
            width: 60px;
            padding: 6px;
            border-radius: 8px;
            border: 1.5px solid #61c061;
            background: #223322;
            font-weight: 600;
            font-family: "Inter", sans-serif;
            color: #a8d6a8;
            user-select: text;
          }
          .mark-btn {
            width: 100%;
            padding: 12px 0;
            border-radius: 30px;
            font-weight: 800;
            font-size: 1.1rem;
            background: #326632;
            text-align: center;
          }
          .undo {
            background: #a73232;
          }
          .done-icon {
            color: #a8d6a8;
            font-size: 1.6rem;
            filter: drop-shadow(0 0 6px #40d540aa);
          }
        `}</style>
      </div>
    );
  };

  // Accordion component
  const Accordion = ({ day, expanded, onToggle, children }) => {
    return (
      <section className="accordion">
        <header
          className="accordion-header"
          onClick={() => onToggle(day)}
          onKeyDown={(e) => e.key === "Enter" && onToggle(day)}
          tabIndex={0}
          role="button"
          aria-expanded={expanded}
        >
          {day}
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
            cursor: pointer;
            color: #7fbf7f;
            font-weight: 700;
            font-size: 1.15rem;
            padding: 14px 20px;
            border-radius: 14px 14px 0 0;
            border-bottom: 1px solid #3c693c;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
          }
          .accordion-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.35s ease;
            padding: 0 20px;
          }
          .accordion-content.expanded {
            max-height: 1000px;
            padding: 12px 20px 20px;
          }
        `}</style>
      </section>
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
          padding-bottom: 72px;
          overflow-x: hidden;
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
          border-radius: 40px;
          padding: 10px 30px;
          display: flex;
          gap: 56px;
          box-shadow: 0 0 20px #222;
          user-select: none;
          z-index: 100;
        }
        nav.bottom-nav button {
          background: none;
          border: none;
          color: #888;
          font-weight: 600;
          font-size: 0.875rem;
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
          font-size: 1rem;
          border-radius: 8px;
          border: none;
          background: #233423;
          color: #acf0ac;
        }
        button:focus,
        input:focus {
          outline: 3px solid #79bc79;
          outline-offset: 2px;
        }
      `}</style>

      <div>
        <header>Workout Tracker</header>

        <main>
          {currentTab === "today" && (
            <>
              <h2>Today's Workouts ({today})</h2>
              {workoutsData[today].map(ex => (
                <WorkoutCard key={ex.id} exercise={ex} day={today} interactive />
              ))}
            </>
          )}
          {currentTab === "history" && (
            <>
              <h2>Workout History</h2>
              <label htmlFor="date-filter" style={{ display: "block", marginBottom: 8 }}>
                Filter by Date
              </label>
              <input id="date-filter" type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
              {filterDate && (
                <button
                  onClick={() => setFilterDate("")}
                  style={{ marginLeft: 8, background: "#933333", borderRadius: 6, color: "white", border: "none", padding: "6px 12px", cursor: "pointer" }}
                >
                  Clear
                </button>
              )}
              {Object.keys(filteredCompletions).length === 0 && filterDate && (
                <p>No workouts found for this date.</p>
              )}
              {Object.entries(filteredCompletions).map(([day, exs]) => (
                <Accordion key={day} day={day} expanded={expandedDays[day]} onToggle={toggleDay}>
                  {Object.entries(exs).map(([id, val]) => {
                    const w = workoutsData[day]?.find(e => e.id === Number(id));
                    return (
                      <div key={id} className="card" style={{ marginBottom: 8 }}>
                        <strong>{w?.name || "Unknown"}</strong> - Sets: {val.sets}, Reps: {val.reps}
                      </div>
                    );
                  })}
                </Accordion>
              ))}
            </>
          )}
          {currentTab === "all" && (
            <>
              <h2>All Workouts</h2>
              {daysOfWeek.map(day => (
                <Accordion key={day} day={day} expanded={expandedDays[day]} onToggle={toggleDay}>
                  {(workoutsData[day] || []).map(ex => (
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

        <nav className="bottom-nav" role="tablist" aria-label="Main navigation">
          <button onClick={() => setCurrentTab("today")} className={currentTab === "today" ? "active" : ""} aria-selected={currentTab === "today"} role="tab">
            <FaDumbbell />
            Today
          </button>
          <button onClick={() => setCurrentTab("history")} className={currentTab === "history" ? "active" : ""} aria-selected={currentTab === "history"} role="tab">
            <FaHistory />
            History
          </button>
          <button onClick={() => setCurrentTab("all")} className={currentTab === "all" ? "active" : ""} aria-selected={currentTab === "all"} role="tab">
            <FaListUl />
            All
          </button>
        </nav>
      </div>
    </>
  );
}
