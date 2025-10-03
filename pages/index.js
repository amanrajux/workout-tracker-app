import React, { useState, useEffect } from "react";
import {
  FaDumbbell,
  FaHistory,
  FaListUl,
  FaCheckCircle,
  FaUndoAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";

const workoutsData = {
  Monday: [
    { id: 1, name: "Chest Press Machine", sets: 4, reps: [8, 10, 12], notes: "Primary Compound Lift", caloriesPerSet: 8 },
    { id: 2, name: "Shoulder Press Machine", sets: 3, reps: [8, 10, 12], notes: "Controlled descent", caloriesPerSet: 7 },
    { id: 3, name: "Pec Fly Machine", sets: 3, reps: [12, 15], notes: "Focus on squeeze", caloriesPerSet: 6 },
    { id: 4, name: "Lateral Raise Machine", sets: 3, reps: [12, 15], notes: "Strict, slow movement", caloriesPerSet: 5 },
    { id: 5, name: "Triceps Extension Machine", sets: 3, reps: [12, 15], notes: "Full contraction", caloriesPerSet: 5 },
    { id: 6, name: "Abdominal Machine", sets: 3, reps: [15, 20], notes: "Slow and controlled crunch", caloriesPerSet: 7 },
  ],
  Tuesday: [
    { id: 7, name: "Seated Leg Press", sets: 4, reps: [10, 12], notes: "Primary Compound Lift, full range", caloriesPerSet: 9 },
    { id: 8, name: "Leg Extension Machine", sets: 3, reps: [12, 15], notes: "Squeeze at the top", caloriesPerSet: 8 },
    { id: 9, name: "Seated Leg Curl", sets: 3, reps: [12, 15], notes: "Focus on the negative", caloriesPerSet: 8 },
    { id: 10, name: "Hip Adduction Machine", sets: 3, reps: [15, 20], notes: "Squeeze glutes", caloriesPerSet: 6 },
    { id: 11, name: "Glute Extension Machine", sets: 3, reps: [12, 15], notes: "Peak contraction", caloriesPerSet: 7 },
    { id: 12, name: "Calf Extension Machine", sets: 3, reps: [15, 20], notes: "Full stretch", caloriesPerSet: 5 },
  ],
  Wednesday: [
    { id: 20, name: "Active Rest & Stretching", sets: 1, reps: ["30-45 min"], notes: "Light mobility", caloriesPerSet: 1 },
  ],
  Thursday: [
    { id: 21, name: "Lat Pulldown", sets: 4, reps: [8, 10, 12], notes: "Pull elbows", caloriesPerSet: 8 },
    { id: 22, name: "Seated Row", sets: 3, reps: [8, 10, 12], notes: "Back squeeze", caloriesPerSet: 7 },
    { id: 23, name: "Assist Dip/Chin", sets: 3, reps: [8, 10], notes: "Minimal assistance", caloriesPerSet: 7 },
    { id: 24, name: "Rear Delt Machine", sets: 3, reps: [12, 15], notes: "Reverse fly", caloriesPerSet: 5 },
    { id: 25, name: "Bicep Curl", sets: 3, reps: [12, 15], notes: "Isolated curls", caloriesPerSet: 5 },
    { id: 26, name: "Back Extension", sets: 3, reps: [12, 15], notes: "Low back", caloriesPerSet: 6 },
  ],
  Friday: [
    { id: 27, name: "Seated Leg Curl", sets: 4, reps: [10, 12], notes: "Hamstrings focus", caloriesPerSet: 9 },
    { id: 28, name: "Inclined Leg Press", sets: 3, reps: [10, 12], notes: "Glutes & hamstrings", caloriesPerSet: 8 },
    { id: 29, name: "Super Squats Machine", sets: 3, reps: [10, 12], notes: "High rep quads ", caloriesPerCalorie: 8 },
    { id: 30, name: "Leg Raises", sets: 3, reps: [15, 20], notes: "Core engagement", caloriesPerCalorie: 6 },
    { id: 31, name: "Russian Twist", sets: 3, reps: ["15/side"], notes: "Oblique focus", caloriesPerCalorie: 5 },
    { id: 32, name: "Abdominal Machine", sets: 3, reps: [15, 20], notes: "Ab focus", caloriesPerCalorie: 7 },
  ],
  Saturday: [
    { id: 33, name: "Elliptical Cardio", sets: 1, reps: ["45 min"], notes: "Steady cardio", caloriesPerCalorie: 130 },
    { id: 34, name: "Stretch & Foam Roll", sets: 1, reps: ["10 min"], notes: "Mobility", caloriesPerCalorie: 1 },
  ],
  Sunday: [
    { id: 35, name: "Rest Day", sets: 0, reps: [], notes: "Recovery", caloriesPerCalorie: 0 },
  ],
};

const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const setsOptions = [3, 4];
const repsOptions = [8, 10, 12];
const manualLabel = "Manual";

export default function Home() {
  const [tab, setTab] = useState("today");
  const [completions, setCompletions] = useState(() => {
    if (typeof window !== "undefined")
      return JSON.parse(localStorage.getItem("workoutCompletions") || "{}");
    return {};
  });
  const [dateFilter, setDateFilter] = useState("");
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined")
      return JSON.parse(localStorage.getItem("darkMode") || "false");
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (dark) document.body.classList.add("dark");
      else document.body.classList.remove("dark");
      localStorage.setItem("darkMode", JSON.stringify(dark));
    }
  }, [dark]);

  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem("workoutCompletions", JSON.stringify(completions));
  }, [completions]);

  function saveCompletion(day, id, data) {
    setCompletions(prev => {
      let dayData = prev[day] || {};
      if (!data) delete dayData[id];
      else dayData[id] = data;
      return { ...prev, [day]: dayData };
    });
  }

  function filterByDate(selectedDate) {
    if (!selectedDate) return completions;
    let filtered = {};
    Object.entries(completions).forEach(([day, exs]) => {
      Object.entries(exs).forEach(([id, val]) => {
        if (val.timestamp && val.timestamp.startsWith(selectedDate)) {
          if (!filtered[day]) filtered[day] = {};
          filtered[day][id] = val;
        }
      });
    });
    return filtered;
  }

  let filteredCompletions = filterByDate(dateFilter);
  let today = daysOfWeek[new Date().getDay()];

  function Workout({ day, ex, interactive }) {
    let saved = completions[day]?.[ex.id];
    const [sets, setSets] = React.useState(saved?.sets || null);
    const [reps, setReps] = React.useState(saved?.reps || null);
    const [manual, setManual] = React.useState(saved?.manual || "");
    const [done, setDone] = React.useState(!!saved?.done);

    React.useEffect(() => {
      setSets(saved?.sets || null);
      setReps(saved?.reps || null);
      setManual(saved?.manual || "");
      setDone(!!saved?.done);
    }, [saved]);

    function onMark() {
      if (!done && sets && (reps || reps === 0)) {
        saveCompletion(day, ex.id, {
          done: true,
          sets,
          reps: reps === manualLabel ? manual : reps,
          manual: reps === manualLabel ? manual : null,
          timestamp: new Date().toISOString(),
        });
        setDone(true);
      } else {
        saveCompletion(day, ex.id, null);
        setDone(false);
      }
    }

    return <div className={`card${done ? " done" : ""}`}>
      <div className="card-header">
        <h3>{ex.name}</h3>
        {done && <FaCheckCircle className="doneIcon" />}
      </div>
      <p className="notes">{ex.notes}</p>
      {interactive && !done && <>
        <div className="selectGroup">
          <div className="setsGroup">
            <span>Sets:</span>
            {setsOptions.map(n => 
            <button key={n} className={sets === n ? "selected" : ""} onClick={() => setSets(n)}>{n}</button>)}
          </div>
          <div className="repsGroup">
            <span>Reps:</span>
            {repsOptions.map(n => 
            <button key={n} className={reps === n ? "selected" : ""} onClick={() => setReps(n)}>{n}</button>)}
            <button className={reps === manualLabel ? "selected" : ""} onClick={() => setReps(manualLabel)}>{manualLabel}</button>
            {reps === manualLabel && <input type="number" min="1" value={manual} onChange={(e) => setManual(e.target.value)} placeholder="Enter reps" />}
          </div>
        </div>
        <button disabled={!sets || (!reps && reps !== manualLabel)} className="markBtn" onClick={onMark}>Mark Done</button>
      </>}
      {interactive && done && <button className="markBtn undo" onClick={onMark}>Undo</button>}

      <style jsx>{`
        .card {
          background: var(--card-bg);
          border-radius: 16px;
          box-shadow: var(--card-shadow);
          padding: 1rem;
          margin-bottom: 1rem;
          color: var(--text-color);
          transition: all 0.3s ease;
        }
        .done {
          background: var(--card-done-bg);
          color: var(--card-done-text);
          box-shadow: var(--card-done-shadow);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .notes {
          font-style: italic;
          opacity: 0.8;
          margin-bottom: 0.75rem;
        }
        button {
          cursor: pointer;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          padding: 0.4rem 0.8rem;
          margin-right: 0.5rem;
          background: var(--accent-color);
          color: #fff;
          transition: background 0.25s ease;
          user-select: none;
        }
        button.selected {
          background: var(--accent-hover);
          box-shadow: 0 0 10px var(--accent-hover);
        }
        button:hover:not(:disabled) {
          background: var(--accent-hover);
        }
        button:disabled {
          cursor: not-allowed;
          background: var(--accent-disabled);
          color: var(--accent-disabled-text);
        }
        .markBtn {
          display: block;
          margin-top: 0.75rem;
          width: 100%;
          border-radius: 20px;
        }
        .undo {
          background: var(--undo-color);
          color: var(--undo-text);
        }
        .doneIcon {
          color: var(--accent-color);
          filter: drop-shadow(0 0 8px var(--accent-shadow));
          font-size: 1.5rem;
        }
        input {
          border-radius: 4px;
          border: 1px solid var(--accent-color);
          padding: 0.3rem 0.5rem;
          width: 4rem;
          font-weight: 600;
          color: var(--text-color);
          background: var(--input-bg);
          font-family: "Inter", sans-serif;
        }
        .selectGroup {
          margin-bottom: 1rem;
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .setsGroup, .repsGroup {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .setsGroup span, .repsGroup span {
          font-weight: 700;
        }
      `}</style>
    </div>
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --accent-color: #256d5b;
          --accent-hover: #2ca785;
          --accent-hover-shadow: #2ca785bb;
          --accent-disabled: #a5c4b7;
          --accent-disabled-text: #5c6f67;
          --undo-color: #c94c4c;
          --undo-text: white;

          --card-bg: white;
          --card-shadow: 0 2px 8px rgba(0,0,0,0.06);
          --card-done-bg: #ebf8f1;
          --card-done-shadow: 0 0 10px #94d4ac;
          --card-done-text: #256d5b;
          --text-color: #1a202c;
          --input-bg: white;

          --nav-bg: white;
          --nav-text: #256d5b;
          --nav-border: #ddd;
          --nav-shadow: 0 -2px 6px rgba(0,0,0,0.05);
        }
        body.dark {
          --accent-color: #94d4ac;
          --accent-hover: #bee3db;
          --accent-hover-shadow: #bee3dbbb;
          --accent-disabled: #3a4b41cc;
          --accent-disabled-text: #87a18d;
          --undo-color: #be5042;
          --undo-text: white;

          --card-bg: #2d3748;
          --card-shadow: 0 2px 8px rgba(0,0,0,0.5);
          --card-done-bg: #256d5b33;
          --card-done-shadow: 0 0 15px #256d5b88;
          --card-done-text: #aad3bb;
          --text-color: #e6fffa;
          --input-bg: #2d3748;

          --nav-bg: #1a202c;
          --nav-text: #94d4ac;
          --nav-border: #2d3748;
          --nav-shadow: 0 -2px 12px rgba(0,0,0,0.7);
        }
        body {
          margin: 0;
          font-family: "Inter", system-ui, sans-serif;
          background-color: var(--card-bg);
          color: var(--text-color);
          transition: all 0.3s ease;
          overflow-x: hidden;
          min-height: 100vh;
          padding-bottom: 56px;
        }
        main {
          max-width: 480px;
          margin: 0 auto;
          padding: 1rem;
        }
        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1rem 0.5rem 1rem;
          user-select: none;
          background: none;
          color: var(--text-color);
        }
        .dark .app-header {
          color: var(--text-color);
        }

        .dark-toggle {
          cursor: pointer;
          user-select: none;
          color: var(--accent-color);
          font-size: 1.4rem;
        }

        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          max-width: 480px;
          background: var(--nav-bg);
          border-top: 1px solid var(--nav-border);
          box-shadow: var(--nav-shadow);
          display: flex;
          z-index: 1000;
        }
        .bottom-nav button {
          flex-grow: 1;
          border: none;
          background: none;
          color: var(--nav-text);
          font-weight: 600;
          cursor: pointer;
          padding: 0.6rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 0.875rem;
          gap: 4px;
          user-select: none;
          transition: color 0.3s ease;
        }
        .bottom-nav button span {
          font-size: 0.75rem;
        }
        .bottom-nav button:hover:not(.active) {
          color: var(--accent-hover);
        }
        .bottom-nav button.active {
          color: var(--accent-color);
          font-weight: 700;
          box-shadow: 0 0 10px var(--accent-shadow);
          transform: scale(1.05);
        }
        .filter-group {
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
        }
        .filter-group input[type="date"] {
          padding: 0.3rem 0.5rem;
          border-radius: 6px;
          border: 1px solid var(--accent-color);
          font-family: inherit;
          font-size: 1rem;
          color: var(--text-color);
          background: var(--input-bg);
          cursor: pointer;
        }
        .filter-group button {
          cursor: pointer;
          background: var(--undo-color);
          border: none;
          color: var(--undo-text);
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          font-weight: 700;
        }
        .filter-group button:hover {
          opacity: 0.8;
        }
        .history-day ul {
          list-style-type: disc;
          margin-left: 1.5rem;
          font-style: italic;
          color: var(--accent-color);
          user-select: none;
        }
        .readonly {
          pointer-events: none;
          user-select: none;
          background-color: var(--card-bg);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          box-shadow: var(--card-shadow);
          color: var(--text-color);
        }
        .readonly h3 {
          margin-top: 0;
          margin-bottom: 0.3rem;
        }
        .readonly p {
          margin-top: 0;
          margin-bottom: 0.3rem;
          font-style: italic;
          color: var(--accent-color);
        }
      `}</style>
    </>
  );
}
