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
const manualLabel = "Manual";

export default function Home() {
  const [tab, setTab] = useState("today");
  const [completions, setCompletions] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("workoutCompletions");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [filterDate, setFilterDate] = useState("");
  const [expandedDays, setExpandedDays] = useState({});

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

  function saveCompletion(day, id, data) {
    setCompletions((prev) => {
      const dayData = prev[day] || {};
      if (data) dayData[id] = data;
      else delete dayData[id];
      return { ...prev, [day]: dayData };
    });
  }

  function completedByDate(date) {
    if (!date) return completions;
    let result = {};
    Object.entries(completions).forEach(([day, exs]) => {
      Object.entries(exs).forEach(([id, val]) => {
        if (val.timestamp && val.timestamp.startsWith(date)) {
          result[day] = result[day] || {};
          result[day][id] = val;
        }
      });
    });
    return result;
  }

  const filteredCompletions = completedByDate(filterDate);
  const today = daysOfWeek[new Date().getDay()];

  function toggleDay(day) {
    setExpandedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  }

  const WorkoutCard = ({ ex, day, interactive }) => {
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
          timestamp: new Date().toISOString(),
        });
        setDone(true);
      } else {
        saveCompletion(day, ex.id, null);
        setDone(false);
      }
    }

    return (
      <div className={`card${done ? " done" : ""}`}>
        <div className="card-header">
          <h4>{ex.name}</h4>
          {done && <FaCheckCircle className="done-icon" />}
        </div>
        <p className="notes">{ex.notes}</p>
        {interactive && !done && (
          <div className="selectors">
            <div className="sets">
              <span>Sets:</span>
              {setsOptions.map((n) => (
                <button key={n} className={sets === n ? "selected" : ""} onClick={() => setSets(n)}>
                  {n}
                </button>
              ))}
            </div>
            <div className="reps">
              <span>Reps:</span>
              {repsOptions.map((n) => (
                <button key={n} className={reps === n ? "selected" : ""} onClick={() => setReps(n)}>
                  {n}
                </button>
              ))}
              <button className={reps === manualLabel ? "selected" : ""} onClick={() => setReps(manualLabel)}>
                {manualLabel}
              </button>
              {reps === manualLabel && (
                <input type="number" min="1" value={manual} onChange={(e) => setManual(e.target.value)} placeholder="Reps" />
              )}
            </div>
          </div>
        )}
        {interactive && (
          <button
            disabled={!sets || (reps === null && reps !== 0)}
            className={`btn-mark${done ? " undo" : ""}`}
            onClick={toggleDone}
          >
            {done ? (
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
            background: #1a1a1a;
            color: #ddd;
            border-radius: 12px;
            padding: 12px 16px;
            margin: 6px 0;
            box-shadow: 0 4px 7px #0009;
          }
          .done {
            background: #2a4d2a;
            color: #adebad;
            box-shadow: 0 0 15px #287328;
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
            font-size: 0.85em;
            margin: 6px 0 10px 0;
          }
          .selectors {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            margin-bottom: 10px;
          }
          .sets, .reps {
            display: flex;
            gap: 6px;
            align-items: center;
          }
          .sets span, .reps span {
            font-weight: 600;
            user-select: none;
            min-width: 40px;
          }
          button {
            background: #2a4d2a;
            border: none;
            padding: 6px 10px;
            border-radius: 10px;
            color: #ddd;
            font-weight: 600;
            cursor: pointer;
            user-select: none;
            transition: background-color 0.2s ease;
          }
          button.selected,
          button:hover {
            background: #3cae3c;
            box-shadow: 0 0 10px #43d843;
            color: white;
          }
          button:disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }
          input[type="number"] {
            width: 3rem;
            padding: 4px;
            border-radius: 6px;
            background: #262626;
            border: 1px solid #3cae3c;
            color: #adffad;
            font-weight: 600;
            user-select: auto;
          }
          .btn-mark {
            width: 100%;
            padding: 10px 0;
            border-radius: 25px;
            background: #287328;
            font-weight: 700;
            font-size: 1.05rem;
            color: #dbfcdc;
            cursor: pointer;
            user-select: none;
          }
          .btn-mark.undo {
            background: #a43232;
          }
          .done-icon {
            color: #58d158;
            font-size: 1.5rem;
            filter: drop-shadow(0 0 5px #4fb44f);
          }
        `}</style>
      );

  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          font-family: "Inter", sans-serif;
          background: #121212;
          color: #ddd;
          min-height: 100vh;
          overflow-x: hidden;
          padding-bottom: 64px; /* for fixed bottom nav */
        }
        main {
          max-width: 480px;
          margin: auto;
          padding: 1rem;
        }
        header {
          padding: 0.75rem 1rem;
          text-align: center;
          font-weight: 800;
          font-size: 1.75rem;
          user-select: none;
          color: #87d887;
        }
        .accordion {
          user-select: none;
          margin-bottom: 20px;
          border-radius: 12px;
          background: #1f1f1f;
          box-shadow: 0 4px 6px #0007;
        }
        .accordion-header {
          cursor: pointer;
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #a0d6a0;
          font-weight: 700;
          border-bottom: 1px solid #304230;
        }
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          padding: 0 20px;
        }
        .accordion-content.open {
          max-height: 500px; /* ample height for content */
          padding: 12px 20px;
        }

        nav.bottom-nav {
          position: fixed;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          background: #1f1f1f;
          border-radius: 36px;
          padding: 10px 30px;
          display: flex;
          gap: 50px;
          box-shadow: 0 0 15px #1f1f1faa;
          z-index: 100;
        }

        nav.bottom-nav button {
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 0.85rem;
          user-select: none;
          transition: color 0.3s ease;
        }
        nav.bottom-nav button.active,
        nav.bottom-nav button:hover {
          color: #6fbb6f;
        }
      `}</style>

      <div>
        <header>Workout Tracker</header>

        <main>
          {tab === "today" && (
            <>
              <h2>{daysOfWeek[new Date().getDay()]}</h2>
              {workoutsData[daysOfWeek[new Date().getDay()]].map((ex) => (
                <WorkoutCard key={ex.id} ex={ex} day={daysOfWeek[new Date().getDay()]} interactive />
              ))}
            </>
          )}

          {tab === "history" && (
            <>
              <h2>History</h2>
              <label htmlFor="dateFilter" style={{display:"block",marginBottom:"8px"}}>
                Filter on date
              </label>
              <input
                id="dateFilter"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                style={{
                  padding:"8px 12px",
                  fontSize:"1rem",
                  width:"180px",
                  borderRadius:"8px",
                  border:"none",
                  boxShadow:"inset 0 0 4px #233"
                }}
              />
              {filterDate && (
                <button onClick={() => setFilterDate("")} style={{
                  marginLeft:"10px",
                  background:"#bb4444",
                  color:"#fff",
                  border:"none",
                  borderRadius:"5px",
                  padding:"8px 14px",
                  cursor:"pointer",
                  userSelect:"none"
                }}>
                  Clear
                </button>
              )}
              <div style={{marginTop:"20px"}}>
                {Object.entries(filteredCompletions).length === 0 && (
                  <p>No records found for the selected date.</p>
                )}
                {Object.entries(filteredCompletions).map(([day, exs]) => (
                  <div key={day} style={{marginBottom:"30px"}}>
                    <h3>{day}</h3>
                    <hr style={{border:"none",borderTop:"1px solid #466846",opacity:"0.5",marginBottom:"8px"}}/>
                    {Object.entries(exs).map(([id, val]) => {
                      const ex = workoutsData[day].find(e => e.id === Number(id));
                      return <div key={id} className="card">{ex?.name || "Unknown"} - Sets: {val.sets}, Reps: {val.reps}</div>;
                    })}
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "all" && (
            <>
              <h2>All Workouts</h2>
              {daysOfWeek.map((day) => (
                <Accordion key={day} title={day}>
                  {workoutsData[day].map((ex) => (
                    <div key={ex.id} className="card" style={{marginBottom:"12px"}}>
                      <h4 style={{marginTop:"0",marginBottom:"0.25rem"}}>{ex.name}</h4>
                      <p style={{marginTop:"0",marginBottom:"0.25rem",fontStyle:"italic"}}>{ex.notes}</p>
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

        <nav className="bottom-nav" role="tablist" aria-label="Main Navigation">
          <button onClick={() => setTab("today")} className={tab==="today" ? "active" : ""} aria-selected={tab==="today"} role="tab">
            <FaDumbbell size={24} />
            Today
          </button>
          <button onClick={() => setTab("history")} className={tab==="history" ? "active" : ""} aria-selected={tab==="history"} role="tab">
            <FaHistory size={24} />
            History
          </button>
          <button onClick={() => setTab("all")} className={tab==="all" ? "active" : ""} aria-selected={tab==="all"} role="tab">
            <FaListUl size={24} />
            All
          </button>
        </nav>
      </div>
    </>
  );
}

function Accordion({title, children}) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <section className="accordion">
      <header className="accordion-header" onClick={() => setIsOpen(!isOpen)} tabIndex={0} onKeyDown={(e)=>{if(e.key==="Enter") setIsOpen(!isOpen)}}>
        <span>{title}</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </header>
      <div className={`accordion-content ${isOpen ? "open" : ""}`}>
        {children}
      </div>
      <style jsx>{`
        .accordion { margin-bottom: 1.5rem; border-radius: 12px; background: #1f1f1f; box-shadow: 0 4px 6px #0007; }
        .accordion-header { cursor: pointer; color: #a0d6a0; font-weight: 700; padding: 12px 1.25rem; border-bottom: 1px solid #304230; display: flex; justify-content: space-between; align-items: center; user-select: none;}
        .accordion-content { max-height: 0; overflow: hidden; transition: max-height 0.25s ease; padding: 0 1.25rem;}
        .accordion-content.open { max-height: 1000px; padding: 1rem 1.25rem; }
      `}</style>
    </section>
  );
}
