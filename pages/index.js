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
    { id: 1, name: "Chest Press Machine", sets: 4, reps: [8, 10, 12], notes: "Primary Compound Lift", caloriesPerMin: 8 },
    { id: 2, name: "Shoulder Press Machine", sets: 3, reps: [8, 10, 12], notes: "Controlled descent", caloriesPerMin: 7 },
    { id: 3, name: "Pec Fly Machine", sets: 3, reps: [12, 15], notes: "Focus on squeeze", caloriesPerMin: 6 },
    { id: 4, name: "Lateral Raise Machine", sets: 3, reps: [12, 15], notes: "Strict, slow movement", caloriesPerMin: 5 },
    { id: 5, name: "Triceps Extension Machine", sets: 3, reps: [12, 15], notes: "Full contraction", caloriesPerMin: 5 },
    { id: 6, name: "Abdominal Machine", sets: 3, reps: [15, 20], notes: "Slow and controlled crunch", caloriesPerMin: 7 },
  ],
  Tuesday: [
    { id: 7, name: "Seated Leg Press", sets: 4, reps: [10, 12], notes: "Primary Compound Lift, full range", caloriesPerMin: 9 },
    { id: 8, name: "Leg Extension Machine", sets: 3, reps: [12, 15], notes: "Squeeze at the top", caloriesPerMin: 8 },
    { id: 9, name: "Seated Leg Curl Machine", sets: 3, reps: [12, 15], notes: "Focus on negative motion", caloriesPerMin: 8 },
    { id: 10, name: "Hip Adduction Machine", sets: 3, reps: [15, 20], notes: "Squeeze glutes", caloriesPerMin: 6 },
    { id: 11, name: "Glute Extension Machine", sets: 3, reps: [12, 15], notes: "Peak contraction", caloriesPerMin: 7 },
    { id: 12, name: "Calf Extension Machine", sets: 3, reps: [15, 20], notes: "Full range calf workout", caloriesPerMin: 5 },
  ],
  Wednesday: [
    { id: 20, name: "Active Rest", sets: 1, reps: ["30-45 min lightweight cardio/stretching"], caloriesPerMin: 1 },
  ],
  Thursday: [
    { id: 21, name: "Lat Pulldown", sets: 4, reps: [8, 10, 12], notes: "Back engagement", caloriesPerMin: 8 },
    { id: 22, name: "Seated Row", sets: 3, reps: [8, 10, 12], notes: "Back strength", caloriesPerMin: 7 },
    { id: 23, name: "Assist Dip/Chin", sets: 3, reps: [8, 10], notes: "Assisted body weight", caloriesPerMin: 7 },
    { id: 24, name: "Rear Delt Machine", sets: 3, reps: [12, 15], notes: "Rear shoulder focus", caloriesPerMin: 5 },
    { id: 25, name: "Bicep Curl", sets: 3, reps: [12, 15], notes: "Isolated arm work", caloriesPerMin: 5 },
    { id: 26, name: "Back Extension", sets: 3, reps: [12, 15], notes: "Lower back core", caloriesPerMin: 6 },
  ],
  Friday: [
    { id: 27, name: "Seated Leg Curl", sets: 4, reps: [10, 12], notes: "Hamstrings focus", caloriesPerMin: 9 },
    { id: 28, name: "Inclined Leg Press", sets: 3, reps: [10, 12], notes: "Quad/glute target", caloriesPerMin: 8 },
    { id: 29, name: "Super Squats", sets: 3, reps: [10, 12], notes: "Quad bulk", caloriesPerMin: 8 },
    { id: 30, name: "Leg Raises", sets: 3, reps: [15, 20], notes: "Core strength", caloriesPerMin: 6 },
    { id: 31, name: "Russian Twist", sets: 3, reps: ["15 per side"], notes: "Obliques", caloriesPerMin: 5 },
    { id: 32, name: "Abdominal Machine", sets: 3, reps: [15, 20], notes: "Core focus", caloriesPerMin: 7 },
  ],
  Saturday: [
    { id: 33, name: "Elliptical/Cardio", sets: 1, reps: ["45 minutes"], caloriesPerMin: 130 },
    { id: 34, name: "Stretch & Foam Roll", sets: 1, reps: ["10 minutes"], caloriesPerMin: 1 },
  ],
  Sunday: [
    { id: 35, name: "Rest", sets: 0, reps: [], caloriesPerMin: 0, notes: "Full rest day" },
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
const manualLabel = "Manual";

export default function Home() {
  const [tab, setTab] = React.useState("today");
  const [completions, setCompletions] = React.useState(() => {
    if(typeof window !== "undefined"){
      const stored = localStorage.getItem('workoutCompletions');
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });
  const [filterDate, setFilterDate] = React.useState("");

  React.useEffect(() => {
    if(typeof window !== "undefined") {
      localStorage.setItem('workoutCompletions', JSON.stringify(completions));
    }
  }, [completions]);

  // Always apply dark mode on mount
  React.useEffect(() => {
    if(typeof window !== "undefined") {
      document.body.classList.add('dark');
    }
  }, []);

  function saveCompletion(day, id, data) {
    setCompletions(prev => {
      const dayData = prev[day] || {};
      if (data) dayData[id] = data;
      else delete dayData[id];
      return { ...prev, [day]: dayData };
    });
  }

  function completedByDate(date) {
    if(!date) return completions;
    let filtered = {};
    Object.entries(completions).forEach(([day, exs]) => {
      Object.entries(exs).forEach(([id, val]) => {
        if(val.timestamp?.startsWith(date)){
          filtered[day] = filtered[day]||{};
          filtered[day][id] = val;
        }
      });
    });
    return filtered;
  }

  let filteredCompletions = completedByDate(filterDate);
  let today = daysOfWeek[new Date().getDay()];

  function WorkoutCard({ day, ex, interactive }) {
    let saved = completions[day]?.[ex.id];
    const [sets, setSets] = React.useState(saved?.sets || null);
    const [reps, setReps] = React.useState(saved?.reps || null);
    const [manualRep, setManualRep] = React.useState(saved?.manual || "");
    const [done, setDone] = React.useState(saved?.done || false);

    React.useEffect(() => {
      setSets(saved?.sets || null);
      setReps(saved?.reps || null);
      setManualRep(saved?.manual || "");
      setDone(saved?.done || false);
    }, [saved]);

    function markDone() {
      if(!done && sets && (reps || reps===0)){
        saveCompletion(day, ex.id, {
          done: true,
          sets,
          reps: reps===manualLabel ? manualRep : reps,
          manual: reps===manualLabel ? manualRep : null,
          timestamp: new Date().toISOString()
        });
        setDone(true);
      } else {
        saveCompletion(day, ex.id, null);
        setDone(false);
      }
    }

    return <div className={`card ${done ? "done":""}`}>
      <div className="cardHeader">
        <h3>{ex.name}</h3>
        {done && <FaCheckCircle className="doneIcon" />}
      </div>
      <p className="notes">{ex.notes}</p>
      {interactive && !done &&
        <div className="selectors">
          <div className="sets">
            <span>Sets:</span>
            {setsOptions.map(opt =>
              <button key={opt} className={opt===sets?"selected":""} onClick={() => setSets(opt)}>{opt}</button>)
            }
          </div>
          <div className="reps">
            <span>Reps:</span>
            {repsOptions.map(opt =>
              <button key={opt} className={opt===reps?"selected":""} onClick={() => setReps(opt)}>{opt}</button>)
            }
            <button className={reps===manualLabel?"selected":""} onClick={() => setReps(manualLabel)}>{manualLabel}</button>
            {reps===manualLabel && <input type="number" min="1" placeholder="Reps" value={manualRep} onChange={e => setManualRep(e.target.value)} />}
          </div>
        </div>
      }
      {interactive && <button onClick={markDone} disabled={!sets || (reps===null && reps!==0)} className={`cta ${done?"undo":""}`}>
        {done ? <><FaUndoAlt/> Undo</> : <><FaCheckCircle/> Mark Done</>}
      </button>}
      <style jsx>{`
        .card {
          background: #121212;
          color: #eee;
          border-radius: 16px;
          box-shadow: 0 8px 20px rgb(0 0 0 / 0.9);
          padding: 1em;
          margin-bottom: 1em;
        }
        .card.done {
          background: #223322;
          box-shadow: 0 8px 30px #2d7a2dcc;
          color: #bdf0bd;
        }
        .cardHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        h3 {
          margin: 0 0 .25em 0;
        }
        .notes {
          font-size: 0.85em;
          font-style: italic;
          opacity: 0.75;
          margin-bottom: .75em;
        }
        .selectors {
          display: flex;
          gap: 1em;
          flex-wrap: wrap;
          margin-bottom: 1em;
        }
        .sets, .reps {
          display: flex;
          align-items: center;
          gap: 0.5em;
        }
        .sets span, .reps span {
          font-weight: 600;
          min-width: 40px;
        }
        button {
          background: #256d5b;
          border: none;
          color: white;
          padding: 0.5em 1em;
          border-radius: 9999px;
          cursor: pointer;
          font-weight: 700;
          user-select: none;
          outline-offset: 2px;
          transition: background-color 0.3s ease;
        }
        button.selected, button:hover:not(:disabled) {
          background: #2ca785;
          box-shadow: 0 0 10px #2ca785ee;
        }
        button:disabled {
          background: #487f71;
          cursor: not-allowed;
        }
        input {
          width: 3.5em;
          padding: 0.4em;
          border-radius: 0.25em;
          border: 1.5px solid #2ca785;
          background: #223322;
          color: #bdf0bd;
          font-weight: 600;
          user-select: auto;
        }
        .cta {
          width: 100%;
          padding: 0.75em 0;
          font-size: 1.1em;
          border-radius: 9999px;
          background: #256d5b;
        }
        .cta.undo {
          background: #cc3a3a;
        }
        .doneIcon {
          font-size: 1.5em;
          color: #bdf0bd;
          filter: drop-shadow(0 0 3px #a8e7a8cc);
        }
      `}</style></div>
  }

  return (
    <>
      <style jsx global>{`
        :root {
          --accent: #256d5b;
        }
        body {
          font-family: 'Inter', sans-serif;
          background: #121212;
          color: #eee;
          margin: 0;
          padding: 0;
        }
        main {
          max-width: 480px;
          margin: auto;
          padding: 1rem;
          padding-bottom: 58px;
          box-sizing: border-box;
        }
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          background: #181818;
          padding: 0.75rem 1.5rem;
          border-radius: 1.5rem 1.5rem 0 0;
          display: flex;
          gap: 2rem;
          z-index: 1000;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.7);
        }
        .bottom-nav button {
          background: transparent;
          border: none;
          color: #bfbfbf;
          font-weight: 600;
          cursor: pointer;
          user-select: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3em;
          font-size: 0.875rem;
        }
        .bottom-nav button.active {
          color: #2ca785;
        }
        .bottom-nav button div {
          font-size: 1.2rem;
        }
      `}</style>

      <div>
        <header className="app-header" style={{ padding: "1rem", textAlign: "center", background: "#181818", color: "#eee" }}>
          <h1 style={{ margin: 0, fontWeight: "900" }}>Workout Tracker</h1>
        </header>

        <main>
          {tab === "today" && <>
            <h2>Today's Workout ({daysOfWeek[new Date().getDay()]})</h2>
            {workoutsData[daysOfWeek[new Date().getDay()]].length === 0 && <p>No workouts scheduled.</p>}
            {workoutsData[daysOfWeek[new Date().getDay()]].map(ex => <WorkoutCard key={ex.id} day={daysOfWeek[new Date().getDay()]} ex={ex} interactive />)}
          </>}

          {tab === "history" && <>
            <h2>Workout History</h2>
            <label>
              Filter by date: &nbsp;
              <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
              {filterDate && <button onClick={() => setFilterDate("")} style={{ marginLeft: "0.5rem", background: "#cc3a3a", color: "#fff", borderRadius: "0.25rem", border: "none", cursor: "pointer" }}>Clear</button>}
            </label>
            <br />
            {filterDate ?
              Object.entries(completedByDate(filterDate)).map(([day, exs]) => (
                <section key={day}>
                  <h3>{day}</h3>
                  <ul>
                    {Object.entries(exs).map(([id, data]) => (
                      <li key={id}>{workoutsData[day].find(w => w.id == id)?.name} - Sets: {data.sets}, Reps: {data.reps}</li>
                    ))}
                  </ul>
                </section>
              ))
              : <p>Please select a date to show history.</p>
            }
          </>}

          {tab === "all" && <>
            <h2>All Workouts</h2>
            {daysOfWeek.map(day => (
              <section key={day}>
                <h3>{day}</h3>
                {workoutsData[day].length === 0 ? <p>No workouts scheduled.</p> :
                  workoutsData[day].map(w => (
                    <div key={w.id} style={{ padding: "1rem", marginBottom: "1rem", background: "#222", borderRadius: "1rem", color: "#eee" }}>
                      <h4>{w.name}</h4>
                      <p style={{ fontStyle: "italic" }}>{w.notes}</p>
                      <p>Sets: {w.sets}, Reps: {Array.isArray(w.reps) ? w.reps.join(", ") : w.reps}</p>
                    </div>
                  ))
                }
              </section>
            ))}
          </>}

        </main>

        <nav className="bottom-nav" role="tablist" aria-label="Main navigation">
          <button onClick={() => setTab("today")} className={tab === "today" ? "active" : ""} role="tab" aria-selected={tab === "today"} aria-controls="maincontent" tabIndex={0}>
            <div><FaDumbbell /></div>
            <span>Today</span>
          </button>
          <button onClick={() => setTab("history")} className={tab === "history" ? "active" : ""} role="tab" aria-selected={tab === "history"} aria-controls="maincontent" tabIndex={0}>
            <div><FaHistory /></div>
            <span>History</span>
          </button>
          <button onClick={() => setTab("all")} className={tab === "all" ? "active" : ""} role="tab" aria-selected={tab === "all"} aria-controls="maincontent" tabIndex={0}>
            <div><FaListUl /></div>
            <span>All</span>
          </button>
        </nav>
      </div>
    );
}

function completedByDate(date) {
  if(!date) return {};
  const stored = localStorage.getItem('workoutCompletions');
  if(!stored) return {};
  const completions = JSON.parse(stored);
  let filtered = {};
  Object.entries(completions).forEach(([day, exs]) => {
    Object.entries(exs).forEach(([id, val]) => {
      if(val.timestamp && val.timestamp.startsWith(date)){
        filtered[day] = filtered[day] || {};
        filtered[day][id] = val;
      }
    });
  });
  return filtered;
}
