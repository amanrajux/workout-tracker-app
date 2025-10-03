import React, { useState, useEffect, useRef } from "react";
import {
  FaDumbbell,
  FaHistory,
  FaListUl,
  FaCheckCircle,
  FaUndoAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const workoutsData = {
  Monday: [
    { id: 1, name: "Chest Press Machine", sets: 4, reps: [8, 10, 12], notes: "Primary Compound Lift", calories: 8 },
    { id: 2, name: "Shoulder Press Machine", sets: 3, reps: [8, 10, 12], notes: "Controlled descent", calories: 7 },
    { id: 3, name: "Pec Fly Machine", sets: 3, reps: [12, 15], notes: "Focus on squeeze", calories: 6 },
    { id: 4, name: "Lateral Raise Machine", sets: 3, reps: [12, 15], notes: "Strict, slow movement", calories: 5 },
    { id: 5, name: "Triceps Extension", sets: 3, reps: [12, 15], notes: "Full contraction", calories: 5 },
    { id: 6, name: "Abdominal Machine", sets: 3, reps: [15, 20], notes: "Slow controlled crunch", calories: 7 },
  ],
  Tuesday: [
    { id: 7, name: "Seated Leg Press", sets: 4, reps: [10, 12], notes: "Primary Compound Lift", calories: 9 },
    { id: 8, name: "Leg Extension", sets: 3, reps: [12, 15], notes: "Squeeze top", calories: 8 },
    { id: 9, name: "Seated Leg Curl", sets: 3, reps: [12, 15], notes: "Focus on negative", calories: 8 },
    { id: 10, name: "Hip Adduction", sets: 3, reps: [15, 20], notes: "Glute squeeze", calories: 6 },
    { id: 11, name: "Glute Extension", sets: 3, reps: [12, 15], notes: "Peak contraction", calories: 7 },
    { id: 12, name: "Calf Raise", sets: 3, reps: [15, 20], notes: "Full range", calories: 5 },
  ],
  Wednesday: [
    { id: 20, name: "Active Rest", reps: ["30-45 Min"], notes: "Light mobility/stretch", calories: 1 },
  ],
  Thursday: [
    { id: 21, name: "Lat Pulldown", sets: 4, reps: [8, 10, 12], notes: "Back engagement", calories: 8 },
    { id: 22, name: "Seated Row", sets: 3, reps: [8,10,12], notes: "Back strengthen", calories:7 },
    { id: 23, name: "Assisted Dip/Chin", sets: 3, reps: [8,10], notes: "Minimal assist", calories:7},
    { id: 24, name: "Rear Delt Fly", sets: 3, reps: [12,15], notes: "Rear shoulder", calories:5},
    { id: 25, name: "Bicep Curl", sets: 3, reps: [12,15], notes: "Arm curl", calories:5},
    { id: 26, name: "Back Extension", sets: 3, reps: [12,15], notes: "Lower back", calories:6},
  ],
  Friday: [
    { id: 27, name: "Seated Leg Curl", sets: 4, reps: [10,12], notes: "Hamstring focus", calories:9 },
    { id: 28, name: "Inclined Leg Press", sets:3, reps:[10,12], notes:"Quad and glute", calories:8 },
    { id: 29, name: "Super Squats", sets:3, reps:[10,12], notes:"High reps quad", calories:8 },
    { id: 30, name: "Leg Raises", sets:3, reps:[15,20], notes:"Core build", calories:6 },
    { id: 31, name: "Russian Twist", sets:3, reps:["15/side"], notes:"Obliques", calories:5},
    { id: 32, name: "Abdominal Machine", sets:3, reps:[15,20], notes:"Strong core", calories:7},
  ],
  Saturday: [
    { id:33, name:"Elliptical Cardio", reps:["45 min"], notes:"Cardio session", calories: 130},
    { id:34, name:"Stretch and Roll", reps:["10 min"], notes:"Mobility", calories: 10},
  ],
  Sunday: [
    { id: 35, name: "Rest Day", reps: [], notes: "Complete rest", calories: 0 },
  ],
};

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const setsOptions = [3, 4];
const repsOptions = [8, 10, 12];
const manualLabel = "Manual";

export default function Home() {
  const [currentTab, setCurrentTab] = React.useState("today");
  const [completions, setCompletions] = React.useState(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("workoutCompletions");
      return data ? JSON.parse(data) : {};
    }
    return {};
  });
  const [filterDate, setFilterDate] = React.useState("");
  const [expanded, setExpanded] = React.useState({});

  const today = daysOfWeek[new Date().getDay()];

  React.useEffect(() => {
    if(typeof window !== "undefined") {
      document.body.classList.add("dark");
    }
  }, []);

  React.useEffect(() => {
    if(typeof window !== "undefined") {
      localStorage.setItem("workoutCompletions", JSON.stringify(completions));
    }
  }, [completions]);

  const toggleExpand = (day) => {
    setExpanded((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const saveCompletion = (day, id, data) => {
    setCompletions((prev) => {
      const dayData = {...prev[day]} || {};
      if (data) dayData[id] = data;
      else delete dayData[id];
      return {...prev, [day]: dayData};
    });
  };

  const filterCompletionsByDate = (date) => {
    if (!date) return completions;
    const res = {};
    for (const [day, exs] of Object.entries(completions)) {
      for (const [id, val] of Object.entries(exs)) {
        if (val.timestamp.startsWith(date)) {
          if (!res[day]) res[day] = {};
          res[day][id] = val;
        }
      }
    }
    return res;
  };

  const filteredCompletions = filterCompletionsByDate(filterDate);

  const WorkoutCard = ({ exercise, day, interactive }) => {
    const stored = completions[day]?.[exercise.id] || {};
    const [sets, setSets] = React.useState(stored.sets || null);
    const [reps, setReps] = React.useState(stored.reps || null);
    const [manual, setManual] = React.useState(stored.manual || "");
    const [done, setDone] = React.useState(stored.done || false);
    const inputRef = React.useRef(null);

    React.useEffect(() => {
      if (reps === manualLabel && inputRef.current) {
        inputRef.current.focus();
      }
    }, [reps]);

    React.useEffect(() => {
      setSets(stored.sets || null);
      setReps(stored.reps || null);
      setManual(stored.manual || "");
      setDone(stored.done || false);
    }, [stored]);

    const handleMark = () => {
      if (!done && sets != null && (reps != null)) {
        saveCompletion(day, exercise.id, {
          sets,
          reps: reps === manualLabel ? manual : reps,
          manual: reps === manualLabel ? manual : null,
          done: true,
          timestamp: new Date().toISOString(),
        });
        setDone(true);
      } else {
        saveCompletion(day, exercise.id, null);
        setDone(false);
      }
    };

    return (
      <div className={`card ${done ? "done" : ""}`}>
        <div className="card-header">
          <h4>{exercise.name}</h4>
          {done && <FaCheckCircle className="done-icon" />}
        </div>
        <p className="notes">{exercise.notes}</p>
        {interactive && !done && (
          <div className="selectors">
            <div className="sets">
              <span>Sets:</span>
              {setsOptions.map((x) => (
                <button key={x} className={sets === x ? "selected" : ""} onClick={() => setSets(x)}>{x}</button>
              ))}
            </div>
            <div className="reps">
              <span>Reps:</span>
              {repsOptions.map((x) => (
                <button key={x} className={reps === x ? "selected" : ""} onClick={() => setReps(x)}>{x}</button>
              ))}
              <button className={reps === manualLabel ? "selected" : ""} onClick={() => setReps(manualLabel)}>{manualLabel}</button>
              {reps === manualLabel && (
                <input
                  ref={inputRef}
                  type="number"
                  min="1"
                  value={manual}
                  onChange={(e) => setManual(e.target.value)}
                  placeholder="Enter Reps"
                />
              )}
            </div>
          </div>
        )}
        {interactive && (
          <button disabled={sets == null || (reps == null)} className={`mark-button ${done ? "undo" : ""}`} onClick={handleMark}>
            {done ? (<><FaUndoAlt /> Undo</>) : (<><FaCheckCircle /> Mark</>)}
          </button>
        )}
        <style jsx>{`
          .card {
            background: #121212;
            border-radius: 15px;
            padding: 15px;
            margin: 10px 0;
            color: #ddd;
            box-shadow: 0 3px 8px #0009;
            transition: background 0.3s ease;
          }
          .done {
            background: #264226;
            box-shadow: 0 0 10px #55aa55cc;
            color: #adebad;
          }
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          h4 {
            margin: 0;
          }
          .notes {
            font-style: italic;
            margin: 10px 0;
          }
          .selectors {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            margin-bottom: 10px;
          }
          .sets, .reps {
            display: flex;
            gap: 10px;
            align-items: center;
          }
          span {
            font-weight: 600;
            width: 50px;
            user-select: none;
          }
          button {
            border: none;
            background: #226622;
            color: white;
            padding: 4px 10px;
            border-radius: 8px;
            cursor: pointer;
            user-select: none;
            font-weight: 600;
            transition: background 0.3s ease;
          }
          button.selected, button:hover {
            background: #55aa55;
            box-shadow: 0 0 8px #55aa55cc;
          }
          button:disabled {
            background: #113311;
            cursor: not-allowed;
            opacity: 0.6;
          }
          input[type="number"] {
            width: 60px;
            padding: 5px 10px;
            border-radius: 8px;
            border: 1px solid #55aa55;
            background: #1f3a1f;
            color: #adebad;
            font-weight: 600;
            font-family: "Inter", sans-serif;
          }
          .mark-button {
            width: 100%;
            border-radius: 30px;
            padding: 11px 0;
            background: #357535;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.3s ease;
          }
          .undo {
            background: #aa3333;
          }
          .done-icon {
            color: #55aa55;
            font-size: 22px;
            filter: drop-shadow(0 0 5px #55aa55);
          }
        `}</style>
      </div>
    );
  };

  const Accordion = ({ day, expanded, onToggle, children }) => (
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
      <div className={`accordion-content${expanded ? " expanded" : ""}`}>
        {children}
      </div>
      <style jsx>{`
        .accordion {
          background: #222;
          border-radius: 15px;
          margin-bottom: 20px;
          box-shadow: 0 0 10px #000a;
          user-select: none;
        }
        .accordion-header {
          cursor: pointer;
          padding: 14px 20px;
          font-weight: 700;
          font-size: 1.1rem;
          color: #7fbb7f;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #335333;
          border-radius: 15px 15px 0 0;
        }
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          padding: 0 20px;
        }
        .accordion-content.expanded {
          max-height: 2000px;
          padding: 12px 20px 20px;
        }
      `}</style>
    </section>
  );

  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          background: #121212;
          color: #ddd;
          font-family: "Inter", sans-serif;
          overflow-x: hidden;
          min-height: 100vh;
          padding-bottom: 70px;
        }
        main {
          max-width: 480px;
          margin: 0 auto;
          padding: 20px;
        }
        header {
          text-align: center;
          font-weight: 900;
          font-size: 1.75rem;
          padding: 20px 0;
          color: #71c671;
          user-select: none;
        }
        nav.bottom-nav {
          position: fixed;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          background: #222;
          border-radius: 40px;
          padding: 10px 30px;
          display: flex;
          gap: 60px;
          box-shadow: 0 0 25px #222222aa;
          z-index: 999;
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
          transition: color 0.3s ease;
          outline-offset: 2px;
        }
        nav.bottom-nav button:hover,
        nav.bottom-nav button:focus-visible {
          color: #71c671;
          outline: none;
        }
        nav.bottom-nav button.active {
          color: #71c671;
        }
        input[type="date"] {
          cursor: pointer;
          padding: 8px 14px;
          margin-left: 10px;
          font-size: 1rem;
          border-radius: 8px;
          border: none;
          background: #233423;
          color: #adebad;
          outline: none;
        }
        button:focus,
        input:focus {
          outline: 2px solid #71c671;
          outline-offset: 2px;
        }
      `}</style>

      <div>
        <header>Workout Tracker</header>
        <main>
          {currentTab === "today" &&
            <>
              <h2>{today}'s Workout</h2>
              {workoutsData[today]?.map(ex => (
                <WorkoutCard key={ex.id} exercise={ex} day={today} interactive />
              ))}
            </>
          }
          {currentTab === "history" &&
            <>
              <h2>History</h2>
              <label htmlFor="filter-date">
                Filter by Date:
                <input id="filter-date" type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
              </label>
              {filterDate && <button onClick={() => setFilterDate('')}>Clear</button>}
              {!filterDate && <p style={{marginTop: 12}}>Select a date to view history</p>}
              {filterDate &&
                (Object.keys(filteredCompletions).length === 0
                  ? <p>No workouts found for this date</p>
                  : Object.entries(filteredCompletions).map(([day, exs]) => (
                    <Accordion key={day} day={day} expanded={expanded[day]} onToggle={toggleExpand}>
                      {Object.entries(exs).map(([exId, val]) => {
                        const ex = workoutsData[day]?.find(w => w.id === Number(exId));
                        return <div key={exId} className="card">{ex?.name ?? "Unknown"} - Sets: {val.sets}, Reps: {val.reps}</div>
                      })}
                    </Accordion>
                  )))
              }
            </>
          }
          {currentTab === "all" &&
            <>
              <h2>All Workouts</h2>
              {daysOfWeek.map(day => (
                <Accordion key={day} day={day} expanded={expanded[day]} onToggle={toggleExpand}>
                  {(workoutsData[day] || []).map(ex => (
                    <div key={ex.id} className="card">
                      <h4>{ex.name}</h4>
                      <p><em>{ex.notes}</em></p>
                      <p>Sets: {ex.sets} | Reps: {Array.isArray(ex.reps) ? ex.reps.join(", ") : ex.reps}</p>
                    </div>
                  ))}
                </Accordion>
              ))}
            </>
          }
        </main>
        <nav className="bottom-nav" role="tablist">
          <button onClick={() => setCurrentTab("today")} className={currentTab === "today" ? "active" : ""} aria-selected={currentTab === "today"} role="tab"> <FaDumbbell /> Today </button>
          <button onClick={() => setCurrentTab("history")} className={currentTab === "history" ? "active" : ""} aria-selected={currentTab === "history"} role="tab"> <FaHistory /> History </button>
          <button onClick={() => setCurrentTab("all")} className={currentTab === "all" ? "active" : ""} aria-selected={currentTab === "all"} role="tab"> <FaListUl /> All </button>
        </nav>
      </div>
    </>
  );

}
