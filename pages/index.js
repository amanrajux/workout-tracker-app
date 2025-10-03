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

const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const setsOptions = [3, 4];
const repsOptions = [8, 10, 12];
const manualLabel = "Manual Entry";

export default function Home() {
  const [currentTab, setCurrentTab] = useState("today");
  const [completions, setCompletions] = useState(() => {
    if(typeof window !== "undefined") {
      const saved = localStorage.getItem("workoutCompletions");
      return saved ? JSON.parse(saved) : {};
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

  const toggleDay = (day) => setExpandedDays(prev => ({...prev, [day]: !prev[day]}))

  function saveCompletion(day, id, data) {
    setCompletions(prev => {
      const dayData = {...(prev[day] || {})};
      if (data) dayData[id] = data;
      else delete dayData[id];
      return {...prev, [day]: dayData}
    });
  }

  function filteredCompletionsByDate(date) {
    if(!date) return completions;
    const filtered = {};
    Object.entries(completions).forEach(([day, exs])=>{
      Object.entries(exs).forEach(([id, val])=>{
        if(val.timestamp && val.timestamp.startsWith(date)) {
          if(!filtered[day]) filtered[day] = {};
          filtered[day][id] = val;
        }
      });
    });
    return filtered;
  }

  const filteredCompletions = filteredCompletionsByDate(filterDate);

  const WorkoutCard = ({ exercise, day, interactive }) => {
    const saved = completions[day]?.[exercise.id] || {};

    const [selectedSets, setSelectedSets] = useState(saved.sets || null);
    const [selectedReps, setSelectedReps] = useState(saved.reps || null);
    const [manualReps, setManualReps] = useState(saved.manual || "");
    const [markedDone, setMarkedDone] = useState(saved.done || false);

    const manualInputRef = useRef(null);

    useEffect(()=>{
      setSelectedSets(saved.sets || null);
      setSelectedReps(saved.reps || null);
      setManualReps(saved.manual || "");
      setMarkedDone(saved.done || false);
    }, [saved]);

    useEffect(()=>{
      if(selectedReps === manualLabel && manualInputRef.current) {
        manualInputRef.current.focus();
      }
    }, [selectedReps]);

    function markDone() {
      if(!markedDone && selectedSets && (selectedReps || selectedReps === 0)) {
        saveCompletion(day, exercise.id, {
          done: true,
          sets: selectedSets,
          reps: selectedReps === manualLabel ? manualReps : selectedReps,
          manual: selectedReps === manualLabel ? manualReps : null,
          timestamp: new Date().toISOString()
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
                {setsOptions.map(opt=>(
                  <button key={opt} className={selectedSets === opt ? "selected": ""} onClick={() => setSelectedSets(opt)}>{opt}</button>
                ))}
              </div>
              <div className="reps">
                <span>Reps:</span>
                {repsOptions.map(opt=>(
                  <button key={opt} className={selectedReps === opt ? "selected" : ""} onClick={() => setSelectedReps(opt)}>{opt}</button>
                ))}
                <button className={selectedReps === manualLabel ? "selected" : ""} onClick={() => setSelectedReps(manualLabel)}>Manual</button>
                {selectedReps === manualLabel && (
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter reps"
                    value={manualReps}
                    onChange={e=>setManualReps(e.target.value)}
                    aria-label="Manual reps input"
                    ref={manualInputRef}
                  />
                )}
              </div>
            </div>
            <button
              className={`mark-btn ${markedDone ? "undo" : ""}`}
              disabled={!selectedSets || (!selectedReps && selectedReps !== manualLabel)}
              onClick={markDone}
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
          <button onClick={markDone} className="mark-btn undo">Undo</button>
        )}
        <style jsx>{`
          .card {
            background: #1a1a1a;
            border-radius: 12px;
            padding: 14px;
            margin-bottom: 12px;
            box-shadow: 0 6px 18px #0006;
            color: #ddd;
            transition: background-color 0.3s ease;
          }
          .done {
            background: #264626;
            color: #a8d6a8;
            box-shadow: 0 0 14px #4bc94b99;
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
            opacity: 0.7;
            margin-bottom: 12px;
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
            min-width: 40px;
            font-weight: 600;
          }
          button {
            padding: 6px 12px;
            border-radius: 10px;
            border: none;
            background: #3a693a;
            color: white;
            font-weight: 600;
            cursor: pointer;
            user-select: none;
            transition: background-color 0.3s;
          }
          button.selected, button:hover:not(:disabled) {
            background: #67d067;
            box-shadow: 0 0 12px #67d067cc;
          }
          button:disabled {
            background: #2a3f2a;
            cursor: not-allowed;
            opacity: 0.65;
          }
          input[type="number"] {
            width: 60px;
            padding: 6px 12px;
            border-radius: 8px;
            border: 1.5px solid #67d067;
            background: #254225;
            color: #abe8ab;
            font-weight: 600;
            font-family: "Inter", sans-serif;
            user-select: auto;
          }
          .mark-btn {
            width: 100%;
            padding: 12px 0;
            border-radius: 30px;
            font-weight: 800;
            font-size: 1.1rem;
            background: #357135;
            color: white;
          }
          .undo {
            background: #b73232;
          }
          .done-icon {
            color: #a8d6a8;
            font-size: 1.7rem;
            filter: drop-shadow(0 0 8px #4ec94e);
          }
        `}</style>
      </div>
    );
  };

  const Accordion = ({ day, expanded, onToggle, children }) => {
    return (
      <section className="accordion">
        <header
          onClick={() => onToggle(day)}
          tabIndex={0}
          role="button"
          aria-expanded={expanded}
          onKeyDown={e => e.key == "Enter" && onToggle(day)}
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
            cursor: pointer;
            color: #7fbf7f;
            font-weight: 700;
            font-size: 1.15rem;
            padding: 14px 20px;
            border-radius: 14px 14px 0 0;
            border-bottom: 1px solid #304030;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .accordion-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.35s ease;
            padding: 0 20px;
          }
          .accordion-content.expanded {
            max-height: 4000px;
            padding: 15px 20px 20px;
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
          box-shadow: 0 0 15px #222222aa;
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
              <h2>History</h2>
              <label htmlFor="filter-date">
                Filter Date
                <input id="filter-date" type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
              </label>
              {filterDate && (
                <button
                  onClick={() => setFilterDate("")}
                  style={{ marginLeft: 8, backgroundColor: "#933333", color: "white", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer" }}
                >
                  Clear
                </button>
              )}
              {!filterDate && <p>Select a date above to view your history.</p>}
              {Object.entries(filteredCompletions).map(([day, exs]) => (
                <Accordion key={day} day={day} expanded={expandedDays[day]} onToggle={toggleDay}>
                  {Object.entries(exs).map(([id, val]) => {
                    const w = workoutsData[day]?.find(e => e.id === Number(id));
                    return (
                      <div key={id} className="card" style={{ marginBottom: 8 }}>
                        <strong>{w?.name || "Unknown Exercise"}</strong>: {val.sets} Sets, {val.reps} Reps
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
                      <p>Sets: {ex.sets} | Reps: {Array.isArray(ex.reps) ? ex.reps.join(", ") : ex.reps}</p>
                    </div>
                  ))}
                </Accordion>
              ))}
            </>
          )}
        </main>

        <nav className="bottom-nav" role="tablist" aria-label="Main navigation">
          <button onClick={() => setCurrentTab("today")} className={currentTab === "today" ? "active" : ""} aria-selected={currentTab === "today"} role="tab" tabIndex={0}>
            <FaDumbbell />
            Today
          </button>
          <button onClick={() => setCurrentTab("history")} className={currentTab === "history" ? "active" : ""} aria-selected={currentTab === "history"} role="tab" tabIndex={0}>
            <FaHistory />
            History
          </button>
          <button onClick={() => setCurrentTab("all")} className={currentTab === "all" ? "active" : ""} aria-selected={currentTab === "all"} role="tab" tabIndex={0}>
            <FaListUl />
            All
          </button>
        </nav>
      </div>
    </>
  );
}
