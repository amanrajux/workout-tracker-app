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

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const setsOptions = [3, 4];
const repsOptions = [8, 10, 12];
const manualLabel = "Manual";

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

  const toggleDay = (day) => setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }));

  function saveCompletion(day, exerciseId, data) {
    setCompletions(prev => {
      const dayData = { ...prev[day] } || {};
      if(data) dayData[exerciseId] = data;
      else delete dayData[exerciseId];
      return { ...prev, [day]: dayData };
    });
  }

  const filterCompletionsByDate = (date) => {
    if(!date) return completions;
    const filtered = {};
    Object.entries(completions).forEach(([day, exs]) =>
      Object.entries(exs).forEach(([exId, val]) => {
        if(val.timestamp && val.timestamp.startsWith(date)) {
          if(!filtered[day]) filtered[day] = {};
          filtered[day][exId] = val;
        }
      })
    );
    return filtered;
  };

  const filteredCompletions = filterCompletionsByDate(filterDate);

  const WorkoutCard = ({ exercise, day, interactive }) => {
    const saved = completions[day]?.[exercise.id] || {};
    const [selectedSets, setSelectedSets] = useState(saved.sets || null);
    const [selectedReps, setSelectedReps] = useState(saved.reps || null);
    const [manualReps, setManualReps] = useState(saved.manual || "");
    const [markedDone, setMarkedDone] = useState(saved.done || false);
    const manualInputRef = useRef(null);

    useEffect(() => {
      setSelectedSets(saved.sets || null);
      setSelectedReps(saved.reps || null);
      setManualReps(saved.manual || "");
      setMarkedDone(saved.done || false);
    }, [saved]);

    useEffect(() => {
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
          timestamp: new Date().toISOString(),
        });
        setMarkedDone(true);
      } else {
        saveCompletion(day, exercise.id, null);
        setMarkedDone(false);
      }
    }

    return (
      <div className={`card${markedDone ? ' done' : ''}`}>
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
                {setsOptions.map(n => (
                  <button key={n} className={selectedSets === n ? 'selected' : ''} onClick={() => setSelectedSets(n)}>{n}</button>
                ))}
              </div>
              <div className="reps">
                <span>Reps:</span>
                {repsOptions.map(n => (
                  <button key={n} className={selectedReps === n ? 'selected' : ''} onClick={() => setSelectedReps(n)}>{n}</button>
                ))}
                <button
                  className={selectedReps === manualLabel ? "selected" : ""}
                  onClick={() => setSelectedReps(manualLabel)}
                >
                  {manualLabel}
                </button>
                {selectedReps === manualLabel && (
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter reps"
                    ref={manualInputRef}
                    value={manualReps}
                    onChange={e => setManualReps(e.target.value)}
                    aria-label="Manual reps input"
                  />
                )}
              </div>
            </div>
            <button
              onClick={markDone}
              className="mark-btn"
              disabled={!selectedSets || (selectedReps === null && selectedReps !== 0)}
            >
              Mark Done
            </button>
          </>
        )}
        {interactive && markedDone && (
          <button className="mark-btn undo" onClick={markDone}>
            Undo
          </button>
        )}

        <style jsx>{`
          .card {
            background: #1a1a1a;
            border-radius: 12px;
            padding: 14px;
            margin: 10px 0;
            box-shadow: 0 5px 15px rgb(0 0 0 / 0.8);
            color: #ddd;
          }
          .done {
            background-color: #285228;
            color: #abe2ab;
            box-shadow: 0 0 14px #40d540aa;
          }
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          h4 {
            margin: 0 0 8px 0;
            user-select: none;
          }
          .notes {
            font-style: italic;
            opacity: 0.7;
            margin-bottom: 12px;
          }
          .selectors {
            display: flex;
            gap: 20px;
            margin-bottom: 12px;
            flex-wrap: wrap;
          }
          .sets, .reps {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          span {
            font-weight: 600;
            min-width: 40px;
            user-select: none;
          }
          button {
            cursor: pointer;
            padding: 6px 12px;
            border-radius: 8px;
            border: none;
            background-color: #3b7d3b;
            color: white;
            font-weight: 600;
            transition: background-color 0.3s ease;
            user-select: none;
          }
          button.selected, button:hover:not(:disabled) {
            background-color: #59c859;
            box-shadow: 0 0 12px #59c859bb;
          }
          button:disabled {
            background-color: #2a4b2a;
            cursor: not-allowed;
            opacity: 0.6;
          }
          input[type="number"] {
            width: 60px;
            padding: 6px 10px;
            border-radius: 6px;
            border: 1.5px solid #59c859;
            background-color: #223522;
            color: #bdeebb;
            font-weight: 600;
            font-family: "Inter", sans-serif;
          }
          .mark-btn {
            width: 100%;
            padding: 12px 0;
            border-radius: 30px;
            font-weight: 700;
            font-size: 1.1rem;
            background-color: #347534;
            transition: background-color 0.3s ease;
          }
          .undo {
            background-color: #b83333;
          }
          .done-icon {
            color: #abe2ab;
            font-size: 1.6rem;
            filter: drop-shadow(0 0 6px #40d540);
          }
        `}</style>
      </div>
    );
  };

  // Accordion component for All & History tabs day grouping
  const Accordion = ({ day, expanded, onToggle, children }) => (
    <section className="accordion">
      <header
        onClick={() => onToggle(day)}
        onKeyDown={(e) => e.key === "Enter" && onToggle(day)}
        tabIndex={0}
        role="button"
        aria-expanded={expanded}
        className="accordion-header"
      >
        {day}
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
          margin-bottom: 1.5rem;
          user-select: none;
        }
        .accordion-header {
          padding: 12px 20px;
          cursor: pointer;
          color: #7ec87e;
          font-weight: 700;
          font-size: 1.15rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #3c693c;
          border-radius: 14px 14px 0 0;
        }
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s ease;
          padding: 0 20px;
        }
        .accordion-content.expanded {
          max-height: 1000px;
          padding-top: 15px;
          padding-bottom: 15px;
        }
      `}</style>
    </section>
  );

  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          font-family: "Inter", sans-serif;
          background-color: #111;
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
          color: #7ec87e;
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
          gap: 60px;
          box-shadow: 0 0 15px #222222aa;
          user-select: none;
          z-index: 999;
        }
        nav.bottom-nav button {
          background: none;
          border: none;
          color: #666;
          font-weight: 600;
          font-size: 0.85rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: color 0.3s ease;
          outline-offset: 2px;
        }
        nav.bottom-nav button:hover,
        nav.bottom-nav button:focus-visible {
          color: #7ec87e;
          outline: none;
        }
        nav.bottom-nav button.active {
          color: #7ec87e;
        }
        input[type="date"] {
          padding: 8px 14px;
          font-size: 1rem;
          border-radius: 8px;
          border: none;
          background-color: #233423;
          color: #aadeac;
          font-family: inherit;
          outline: none;
          margin-left: 0.5rem;
          user-select: text;
        }
        button:focus,
        input:focus {
          outline: 3px solid #6abf6a;
          outline-offset: 2px;
        }
      `}</style>

      <div>
        <header>Workout Tracker</header>

        <main>
          {currentTab === "today" && (
            <>
              <h2>Today's Workouts ({today})</h2>
              {workouts[today].map(ex => (
                <WorkoutCard key={ex.id} exercise={ex} day={today} interactive />
              ))}
            </>
          )}

          {currentTab === "history" && (
            <>
              <h2>Workout History</h2>
              <label htmlFor="date-filter">
                Filter by Date:
                <input
                  id="date-filter"
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
                {filterDate && (
                  <button onClick={() => setFilterDate("")} style={{ marginLeft: 8, background: "#a33232", color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer" }}>
                    Clear
                  </button>
                )}
              </label>
              {Object.keys(filteredCompletions).length === 0 && filterDate && (
                <p style={{ marginTop: 12 }}>No workouts found for this date.</p>
              )}
              {Object.entries(filteredCompletions).map(([day, exs]) => (
                <Accordion key={day} day={day} expanded={expandedDays[day]} onToggle={toggleDay}>
                  {Object.entries(exs).map(([id, val]) => {
                    const w = workouts[day]?.find(e => e.id === Number(id));
                    return (
                      <div key={id} className="card" style={{ marginBottom: "8px" }}>
                        <strong>{w?.name || "Unknown"}</strong> - Sets: {val.sets} Reps: {val.reps}
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
                  {(workouts[day] || []).map(ex => (
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
      <div className={`accordion-content${expanded ? " expanded" : ""}`}>
        {children}
      </div>
      <style jsx>{`
        .accordion {
          background: #222;
          border-radius: 14px;
          box-shadow: 0 0 10px #000a;
          margin-bottom: 24px;
          user-select: none;
        }
        .accordion-header {
          padding: 14px 20px;
          cursor: pointer;
          color: #7bc37b;
          font-weight: 700;
          font-size: 1.15rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #304030;
          border-radius: 14px 14px 0 0;
          user-select: none;
        }
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease;
          padding: 0 20px;
        }
        .accordion-content.expanded {
          max-height: 1000px;
          padding: 14px 20px 20px;
        }
      `}</style>
    </section>
  );
}
