import React, { useState, useEffect } from "react";
import {
  FaDumbbell,
  FaHistory,
  FaListUl,
  FaCheckCircle,
  FaUndoAlt
} from "react-icons/fa";

const workoutsData = {
  Monday: [
    { id: 1, name: "Chest Press Machine", sets: 4, reps: [8, 10, 12], notes: "Primary Compound Lift" },
    // add other exercises...
  ],
  Tuesday: [
    // exercises...
  ],
  Wednesday: [
    // exercises...
  ],
  Thursday: [
    // exercises...
  ],
  Friday: [
    // exercises...
  ],
  Saturday: [
    // exercises...
  ],
  Sunday: [
    // exercises...
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

  // Always force dark mode from start for consistency
  useEffect(() => {
    if (typeof window !== "undefined") document.body.classList.add("dark");
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("workoutCompletions", JSON.stringify(completions));
    }
  }, [completions]);

  function saveCompletion(day, id, data) {
    setCompletions(prev => {
      const dayData = { ...(prev[day] || {}) };
      if (data) dayData[id] = data;
      else delete dayData[id];
      return { ...prev, [day]: dayData };
    });
  }

  // Helper: fetch data filtered by date
  function completedByDate(date) {
    if (!date) return {};
    const stored = localStorage.getItem("workoutCompletions");
    const completions = stored ? JSON.parse(stored) : {};
    let result = {};
    Object.entries(completions).forEach(([day, exs]) => {
      Object.entries(exs).forEach(([id, val]) => {
        if (val.timestamp?.startsWith(date))
          result[day] = result[day] || {};
          result[day][id] = val;
      });
    });
    return result;
  }

  const filtered = filterDate ? completedByDate(filterDate) : completions;

  const today = daysOfWeek[new Date().getDay()];

  // Workout component
  const Workout = ({ day, ex, interactive }) => {
    const saved = completions[day]?.[ex.id];
    const [sets, setSets] = useState(saved?.sets || null);
    const [reps, setReps] = useState(saved?.reps || null);
    const [manual, setManual] = useState(saved?.manual || "");
    const [done, setDone] = useState(saved?.done || false);

    useEffect(() => {
      setSets(saved?.sets || null);
      setReps(saved?.reps || null);
      setManual(saved?.manual || "");
      setDone(saved?.done || false);
    }, [saved]);

    function toggleDone() {
      if (!done && sets && (reps || reps === 0)) {
        saveCompletion(day, ex.id, {
          done: true,
          sets,
          reps: reps === manualLabel ? manual : reps,
          manual: reps === manualLabel ? manual : null,
          timestamp: new Date().toISOString()
        });
        setDone(true);
      } else {
        saveCompletion(day, ex.id, null);
        setDone(false);
      }
    }

    return (
      <div className={`card ${done ? "done" : ""}`}>
        <div className="header">
          <h3>{ex.name}</h3>
          {done && <FaCheckCircle className="icon" />}
        </div>
        <p className="notes">{ex.notes}</p>
        {interactive && !done && (
          <div className="selectors">
            <div className="sets">
              <span>Sets:</span>
              {setsOptions.map((n) => (
                <button key={n} className={sets===n?"selected":""} onClick={() => setSets(n)}>{n}</button>
              ))}
            </div>
            <div className="reps">
              <span>Reps:</span>
              {repsOptions.map(n => (
                <button key={n} className={reps===n?"selected":""} onClick={() => setReps(n)}>{n}</button>
              ))}
              <button className={reps===manualLabel?"selected":""} onClick={() => setReps(manualLabel)}>{manualLabel}</button>
              {reps===manualLabel && <input type="number" min="1" placeholder="Reps" value={manual} onChange={e=>setManual(e.target.value)} />}
            </div>
          </div>
        )}
        {interactive && (
          <button disabled={!sets || (reps===null && reps!==0)} className={`cta ${done?"undo":""}`} onClick={toggleDone}>
            {done ? <> <FaUndoAlt/> Undo </> : <> <FaCheckCircle/> Mark done </>}
          </button>
        )}

        <style jsx>{`
          .card {
            background: #222;
            border-radius: 16px;
            padding: 1em;
            box-shadow: 0 8px 20px rgb(0 0 0 / 0.9);
            margin-bottom: 1em;
            color: #eee;
            transition: all 0.3s ease;
          }
          .done {
            background: #111;
            box-shadow: 0 0 20px #000;
            color: #bbb;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          h3 {
            margin: 0;
          }
          .notes {
            font-style: italic;
            opacity: 0.7;
            font-size: 0.85em;
            margin-bottom: 0.75em;
          }
          .selectors {
            display: flex;
            flex-wrap: wrap;
            gap: 1em;
            margin-bottom: 1em;
          }
          .sets, .reps {
            display: flex;
            gap: 0.7em;
            align-items: center;
          }
          span {
            font-weight: 600;
            min-width: 50px;
            display: inline-block;
          }
          button {
            background: #444;
            color: #eee;
            border: none;
            padding: 0.4em 0.8em;
            border-radius: 0.75em;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s ease;
          }
          button.selected, button:hover:enabled {
            background: #666;
            box-shadow: 0 0 10px #666;
          }
          button:disabled {
            background: #333;
            cursor: not-allowed;
            opacity: 0.7;
          }
          input {
            width: 3.5em;
            padding: 0.3em;
            border-radius: 4px;
            border: 1px solid #666;
            background: #222;
            color: #eee;
            font-family: "Inter", sans-serif;
            font-weight: 600;
            outline: none;
          }
          .cta {
            display: block;
            width: 100%;
            margin-top: 1em;
            padding: 0.75em;
            background: #555;
            border-radius: 1.2em;
            font-size: 1.1em;
            text-align: center;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.3s ease;
          }
          .undo {
            background: #a33;
          }
          .icon {
            font-size: 1.6em;
            filter: drop-shadow(0 0 4px #000);
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          background: #111;
          color: #eee;
          transition: all 0.3s ease;
        }
      `}</style>

      <div>
        <header style={{ padding: "1em", textAlign: "center" }}>
          <h1 style={{ margin: 0, fontWeight: 900 }}>Workout Tracker</h1>
        </header>

        {/* Tabs fixed at bottom, centered */}
        <nav
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            maxWidth: "480px",
            display: "flex",
            justifyContent: "center",
            padding: "0.75em 1em",
            background: "#222",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.8)",
            borderRadius: "1rem 1rem 0 0",
            zIndex: 999,
          }}
        >
          <button
            style={{ margin: "0 1em" }}
            onClick={() => setTab("today")}
            className={tab === "today" ? "active" : ""}
            aria-label="Today"
          >
            <FaDumbbell />
            Today
          </button>
          <button
            style={{ margin: "0 1em" }}
            onClick={() => setTab("history")}
            className={tab === "history" ? "active" : ""}
            aria-label="History"
          >
            <FaHistory />
            History
          </button>
          <button
            style={{ margin: "0 1em" }}
            onClick={() => setTab("all")}
            className={tab === "all" ? "active" : ""}
            aria-label="All Workout"
          >
            <FaListUl />
            All
          </button>
        </nav>

        <main>
          {tab === "today" && (
            <>
              <h2>{daysOfWeek[new Date().getDay()]}</h2>
              {workoutsData[daysOfWeek[new Date().getDay()]].map(w => (
                <Workout key={w.id} day={daysOfWeek[new Date().getDay()]} ex={w} interactive />
              ))}
            </>
          )}
          {tab === "history" && (
            <>
              <h2>History</h2>
              <label htmlFor="date">Filter date: </label>
              <input
                type="date"
                id="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
              {filterDate && <button onClick={() => setFilterDate("")}>Clear</button>}
              {Object.keys(completions).length === 0 && <p>No history</p>}
              {Object.keys(completions).map(day => (
                <div key={day}>
                  <h4>{day}</h4>
                  <ul>
                    {Object.entries(completions[day]).map(([id, val]) => (
                      <li key={id}>{workoutsData[day].find(w => w.id==id)?.name} – Sets: {val.sets}, Reps: {val.reps}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}
          {tab === "all" && (
            <>
              <h2>All Workouts</h2>
              {daysOfWeek.map(day => (
                <div key={day}>
                  <h3>{day}</h3>
                  {workoutsData[day].map(w => (
                    <div key={w.id} className="readonly">
                      <h4>{w.name}</h4>
                      <p style={{ fontStyle: "italic" }}>{w.notes}</p>
                      <p>
                        Sets: {w.sets} Reps: {Array.isArray(w.reps) ? w.reps.join(", ") : w.reps}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
        </main>
      </div>
    </>
  );
}
