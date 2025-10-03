import React, { useState, useEffect, useRef } from "react";
import { FaDumbbell, FaHistory, FaListUl, FaCheckCircle, FaUndoAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";

const workoutData = {
  Monday: [
    { id: 1, name: "Chest Press Machine", sets: 4, reps: [8, 10, 12], notes: "Primary Compound Lift" },
    { id: 2, name: "Shoulder Press Machine", sets: 3, reps: [8, 10, 12], notes: "Controlled descent" },
    { id: 3, name: "Pec Fly Machine", sets: 3, reps: [12, 15], notes: "Focus on squeeze" },
    { id: 4, name: "Lateral Raise Machine", sets: 3, reps: [12, 15], notes: "Strict, slow movement" },
    { id: 5, name: "Triceps Extension Machine", sets: 3, reps: [12, 15], notes: "Full contraction" },
    { id: 6, name: "Abdominal Machine", sets: 3, reps: [15, 20], notes: "Slow controlled crunch" },
  ],
  Tuesday: [
    { id: 7, name: "Seated Leg Press", sets: 4, reps: [10, 12], notes: "Primary Compound Lift, full range" },
    { id: 8, name: "Leg Extension Machine", sets: 3, reps: [12, 15], notes: "Squeeze at the top" },
    { id: 9, name: "Seated Leg Curl Machine", sets: 3, reps: [12, 15], notes: "Focus on negative" },
    { id: 10, name: "Hip Adduction Machine", sets: 3, reps: [15, 20], notes: "Squeeze glutes" },
    { id: 11, name: "Glute Extension Machine", sets: 3, reps: [12, 15], notes: "Peak contraction" },
    { id: 12, name: "Calf Extension Machine", sets: 3, reps: [15, 20], notes: "Full stretch & squeeze" },
  ],
  Wednesday: [
    { id: 20, name: "Active Rest / Stretching", sets: 1, reps: ["30-45 Min"], notes: "Light cardio and mobility" },
  ],
  Thursday: [
    { id: 21, name: "Lat Pulldown Machine", sets: 4, reps: [8, 10, 12], notes: "Pull with elbows" },
    { id: 22, name: "Seated Row Machine", sets: 3, reps: [8, 10, 12], notes: "Pull to lower abs" },
    { id: 23, name: "Assist Dip/Chin Machine", sets: 3, reps: [8, 10], notes: "Minimal assistance" },
    { id: 24, name: "Rear Delt Machine", sets: 3, reps: [12, 15], notes: "Reverse pec fly" },
    { id: 25, name: "Bicep Curl Machine", sets: 3, reps: [12, 15], notes: "Controlled descent" },
    { id: 26, name: "Back Extension Machine", sets: 3, reps: [12, 15], notes: "Lower back/core" },
  ],
  Friday: [
    { id: 27, name: "Seated Leg Curl Machine", sets: 4, reps: [10, 12], notes: "Hamstring focus" },
    { id: 28, name: "Inclined Leg Press", sets: 3, reps: [10, 12], notes: "Quad and glute" },
    { id: 29, name: "Super Squats Machine", sets: 3, reps: [10, 12], notes: "High rep quad" },
    { id: 30, name: "Leg Raises (Captain's Chair)", sets: 3, reps: [15, 20], notes: "Vertical leg raises" },
    { id: 31, name: "Russian Twist", sets: 3, reps: ["15/side"], notes: "Use dumbbell or plate" },
    { id: 32, name: "Abdominal Machine", sets: 3, reps: [15, 20], notes: "Strong core focus" },
  ],
  Saturday: [
    { id: 33, name: "Elliptical / Cardio", sets: 1, reps: ["45-50 Min"], notes: "Steady state cardio" },
    { id: 34, name: "Stretching / Foam Rolling", sets: 1, reps: ["10-15 Min"], notes: "Mobility work" },
  ],
  Sunday: [
    { id: 35, name: "Full Rest", sets: 0, reps: [], notes: "Recovery and nutrition focus" },
  ],
};

const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const setsOptions = [3, 4];
const repsOptions = [8, 10, 12];
const manualLabel = "Manual Entry";

function Accordion({ day, expanded, toggle, children }) {
  return (
    <section className="accordion">
      <header
        className="accordion-header"
        role="button"
        tabIndex={0}
        onClick={() => toggle(day)}
        onKeyDown={e => e.key === "Enter" && toggle(day)}
        aria-expanded={expanded}
      >
        {day}
        {expanded ? <FaChevronUp /> : <FaChevronDown />}
      </header>
      <div className={`accordion-content ${expanded ? "expanded" : ""}`}>
        {children}
      </div>
      <style jsx>{`
        .accordion {
          background: #222;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          box-shadow: 0 5px 10px rgba(0,0,0,0.5);
          user-select: none;
        }
        .accordion-header {
          padding: 12px 20px;
          font-weight: 700;
          font-size: 1.15rem;
          color: #77bb77;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #336633;
          border-radius: 12px 12px 0 0;
        }
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, padding 0.3s ease;
          padding: 0 20px;
        }
        .accordion-content.expanded {
          max-height: 1000px;
          padding: 12px 20px 20px;
        }
      `}</style>
    </section>
  );
}

function WorkoutCard({ exercise, day, interactive }) {
  const storedCompletion = React.useRef(null);
  const [sets, setSets] = useState(null);
  const [reps, setReps] = useState(null);
  const [manualReps, setManualReps] = useState("");
  const [markedDone, setMarkedDone] = useState(false);

  React.useEffect(() => {
    if(typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("workoutCompletions") || "{}");
      storedCompletion.current = saved[day]?.[exercise.id] || null;
      if (storedCompletion.current) {
        setSets(storedCompletion.current.sets);
        setReps(storedCompletion.current.reps);
        setManualReps(storedCompletion.current.manual || "");
        setMarkedDone(storedCompletion.current.done);
      }
    }
  }, [day, exercise.id]);

  const manualInputRef = useRef(null);

  React.useEffect(() => {
    if (reps === manualLabel && manualInputRef.current) {
      manualInputRef.current.focus();
    }
  }, [reps]);

  function markDone() {
    if(!markedDone && sets && (reps || reps === 0 || reps === manualLabel)) {
      const repValue = reps === manualLabel ? manualReps : reps;
      if(repValue === "" || repValue === null) {
        alert("Please enter reps for manual entry.");
        if(manualInputRef.current) manualInputRef.current.focus();
        return;
      }
      let saved = JSON.parse(localStorage.getItem("workoutCompletions") || "{}");
      if(!saved[day]) saved[day] = {};
      saved[day][exercise.id] = {
        sets,
        reps: repValue,
        manual: reps === manualLabel ? manualReps : null,
        done: true,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("workoutCompletions", JSON.stringify(saved));
      storedCompletion.current = saved[day][exercise.id];
      setMarkedDone(true);
    } else {
      let saved = JSON.parse(localStorage.getItem("workoutCompletions") || "{}");
      if(saved[day]) delete saved[day][exercise.id];
      localStorage.setItem("workoutCompletions", JSON.stringify(saved));
      storedCompletion.current = null;
      setMarkedDone(false);
    }
  }

  return (
    <div className={`card ${markedDone ? "done" : ""}`}>
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
              {setsOptions.map(x => (
                <button key={x} className={sets === x ? "selected" : ""} onClick={() => setSets(x)}>{x}</button>
              ))}
            </div>
            <div className="reps">
              <span>Reps:</span>
              {repsOptions.map(x => (
                <button key={x} className={reps === x ? "selected" : ""} onClick={() => setReps(x)}>{x}</button>
              ))}
              <button className={reps === manualLabel ? "selected" : ""} onClick={() => setReps(manualLabel)}>{manualLabel}</button>
              {reps === manualLabel && (
                <input type="number" min="1" placeholder="Enter reps" ref={manualInputRef} value={manualReps} onChange={e => setManualReps(e.target.value)} />
              )}
            </div>
          </div>
          <button onClick={markDone} disabled={!sets || (reps === null) || (reps === manualLabel && !manualReps)} className="mark-button">
            Mark Done
          </button>
        </>
      )}
      {interactive && markedDone && (
        <button onClick={markDone} className="mark-button undo">
          Undo
        </button>
      )}
      <style jsx>{`
        .card {
          background: #121a17;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 16px;
          color: #ddd;
          box-shadow: 0 5px 15px rgb(0 0 0 / 0.5);
        }
        .card.done {
          background: #256d5b33;
          color: #aad3bb;
          box-shadow: 0 0 20px #256d5bcc;
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
          display: flex;
          gap: 20px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .sets, .reps {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        button {
          padding: 6px 12px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-weight: 700;
          transition: background-color 0.3s;
          background: #256d5b;
          color: white;
          user-select: none;
        }
        button:hover:not(:disabled),
        button.selected {
          background-color: #2ca785;
          box-shadow: 0 0 10px #2ca785cc;
        }
        button:disabled {
          background: #1a432a;
          opacity: 0.6;
          cursor: not-allowed;
        }
        input[type="number"] {
          width: 60px;
          padding: 6px 10px;
          border-radius: 0.4rem;
          border: 1.5px solid #2ca785;
          background-color: #233622;
          color: #adebad;
          font-weight: 600;
        }
        .mark-button {
          width: 100%;
          padding: 12px;
          border-radius: 2rem;
          font-size: 1.1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          user-select: none;
        }
        .mark-button.undo {
          background-color: #c43d3d;
        }
        .done-icon {
          color: #aad3bb;
          font-size: 1.7rem;
        }
      `}</style>
    </div>
  )
}

export default function App() {
  const [currentTab, setCurrentTab] = useState("today");
  const [filterDate, setFilterDate] = useState("");
  const [expandedDays, setExpandedDays] = useState({});

  const toggleDay = (day) => setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }));

  const today = daysOfWeek[new Date().getDay()];
  const completions = JSON.parse(localStorage.getItem("workoutCompletions") || "{}");

  const filteredCompletions = React.useMemo(() => {
    if (!filterDate) return completions;
    const filtered = {};
    for (const [day, exs] of Object.entries(completions)) {
      for (const [id, val] of Object.entries(exs)) {
        if (val.timestamp && val.timestamp.startsWith(filterDate)) {
          if (!filtered[day]) filtered[day] = {};
          filtered[day][id] = val;
        }
      }
    }
    return filtered;
  }, [filterDate, completions]);

  useEffect(() => {
    document.body.classList.add("dark");
  }, []);

  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          font-family: "Inter", sans-serif;
          background-color: #121212;
          color: #ccc;
          overflow-x: hidden;
          min-height: 100vh;
          padding-bottom: 70px;
        }
        main {
          max-width: 480px;
          margin: 0 auto;
          padding: 1rem;
        }
        header {
          font-size: 1.8rem;
          font-weight: bold;
          padding: 1rem 0;
          text-align: center;
          color: #7fbf7f;
          user-select: none;
        }
        nav.bottom-nav {
          position: fixed;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #222;
          border-radius: 40px;
          padding: 10px 30px;
          display: flex;
          justify-content: space-around;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 0 15px #222222aa;
          user-select: none;
          z-index: 1000;
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
        nav.bottom-nav button.active,
        nav.bottom-nav button:hover,
        nav.bottom-nav button:focus-visible {
          color: #7fbf7f;
          outline: none;
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
        }
        button:focus,
        input:focus {
          outline: 3px solid #7fbf7f;
          outline-offset: 2px;
        }
        .accordion {
          background: #222;
          border-radius: 15px;
          margin-bottom: 24px;
          user-select: none;
          box-shadow: 0 0 10px #0008;
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
          border-radius: 15px 15px 0 0;
        }
        .accordion-content {
          max-height: 0;
          transition: max-height 0.3s ease;
          overflow: hidden;
          padding: 0 20px;
        }
        .accordion-content.expanded {
          max-height: 1000px;
          padding: 15px 20px 20px;
        }
      `}</style>
      <div>
        <header>Workout Tracker</header>
        <main>
          {/* Today Tab */}
          {currentTab === "today" && (
            <>
              <h2>{today} Workout</h2>
              {workoutData[today].map((ex) => (
                <WorkoutCard key={ex.id} exercise={ex} day={today} interactive />
              ))}
            </>
          )}

          {/* History Tab */}
          {currentTab === "history" && (
            <>
              <h2>History</h2>
              <label htmlFor="filter-date">
                Filter by Date:
                <input id="filter-date" type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
              </label>
              {filterDate && (
                <button onClick={() => setFilterDate("")} style={{ marginLeft: 10, borderRadius: 6, backgroundColor: '#a83333', color:'#fff', border:'none', padding: '6px 12px', cursor: 'pointer' }}>
                  Clear
                </button>
              )}
              {filterDate === "" && <p>Please select a date above to view workout history.</p>}
              {filterDate !== "" &&
                (Object.keys(filteredCompletions).length === 0 ? (
                  <p>No workouts found for this date.</p>
                ) : (
                  Object.entries(filteredCompletions).map(([day, exs]) => (
                    <Accordion key={day} day={day} expanded={expanded[day]} toggle={toggleDay}>
                      {Object.entries(exs).map(([id, val]) => {
                        const w = workoutData[day]?.find(e => e.id === Number(id));
                        return (
                          <div key={id} className="card" style={{ marginBottom: 8 }}>
                            <strong>{w?.name || "Unknown Exercise"}</strong>: Sets {val.sets}, Reps {val.reps}
                          </div>
                        );
                      })}
                    </Accordion>
                  ))
                ))}
            </>
          )}

          {/* All Tab */}
          {currentTab === "all" && (
            <>
              <h2>All Workouts</h2>
              {daysOfWeek.map((day) => (
                <Accordion key={day} day={day} expanded={expanded[day]} toggle={toggleDay}>
                  {(workoutData[day] || []).map((ex) => (
                    <div key={ex.id} className="card" style={{ marginBottom: 12 }}>
                      <h4>{ex.name}</h4>
                      <p style={{ fontStyle: "italic", marginBottom: 8 }}>{ex.notes}</p>
                      <p>Sets: {ex.sets} | Reps: {Array.isArray(ex.reps) ? ex.reps.join(", ") : ex.reps}</p>
                    </div>
                  ))}
                </Accordion>
              ))}
            </>
          )}
        </main>
        <nav className="bottom-nav" role="tablist" aria-label="Tabs Navigation">
          <button onClick={() => setCurrentTab("today")} className={currentTab === "today" ? "active" : ""} role="tab" aria-selected={currentTab === "today"}>
            <FaDumbbell size={24} />
            Today
          </button>
          <button onClick={() => setCurrentTab("history")} className={currentTab === "history" ? "active" : ""} role="tab" aria-selected={currentTab === "history"}>
            <FaHistory size={24} />
            History
          </button>
          <button onClick={() => setCurrentTab("all")} className={currentTab === "all" ? "active" : ""} role="tab" aria-selected={currentTab === "all"}>
            <FaListUl size={24} />
            All
          </button>
        </nav>
      </div>
    </>
  );
}
