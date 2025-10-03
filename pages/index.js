import React, { useState, useEffect } from "react";
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
const manualLabel = "Manual Entry";

export default function Home() {
  const [tab, setTab] = useState("today");
  const [completions, setCompletions] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("workoutCompletions") || "{}");
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

  const toggleDay = (day) => {
    setExpandedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const saveCompletion = (day, id, data) => {
    setCompletions((prev) => {
      const dayData = prev[day] || {};
      if (data) dayData[id] = data;
      else delete dayData[id];
      return { ...prev, [day]: dayData };
    });
  };

  const completedByFilterDate = (date) => {
    if (!date) return completions;
    const filtered = {};
    Object.entries(completions).forEach(([day, exs]) => {
      Object.entries(exs).forEach(([id, val]) => {
        if (val.timestamp && val.timestamp.startsWith(date)) {
          if (!filtered[day]) filtered[day] = {};
          filtered[day][id] = val;
        }
      });
    });
    return filtered;
  };

  const filteredCompletions = completedByFilterDate(filterDate);
  const today = daysOfWeek[new Date().getDay()];

  const WorkoutCard = ({ exercise, day, interactive }) => {
    const saved = completions[day]?.[exercise.id];
    const [sets, setSets] = useState(saved?.sets || null);
    const [reps, setReps] = useState(saved?.reps || null);
    const [manual, setManual] = useState(saved?.manual || "");
    const [markedDone, setMarkedDone] = useState(!!saved?.done);

    useEffect(() => {
      setSets(saved?.sets || null);
      setReps(saved?.reps || null);
      setManual(saved?.manual || "");
      setMarkedDone(!!saved?.done);
    }, [saved]);

    function markDone() {
      if (!markedDone && sets && (reps || reps === 0)) {
        saveCompletion(day, exercise.id, {
          done: true,
          sets,
          reps: reps === manualLabel ? manual : reps,
          manual: reps === manualLabel ? manual : null,
          timestamp: new Date().toISOString(),
        });
        setMarkedDone(true);
      } else {
        saveCompletion(day, exercise.id, null);
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
          <div className="selectors">
            <div className="sets">
              <span>Sets:</span>
              {setsOptions.map((opt) => (
                <button
                  key={opt}
                  className={sets === opt ? "selected" : ""}
                  onClick={() => setSets(opt)}
                  type="button"
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="reps">
              <span>Reps:</span>
              {repsOptions.map((opt) => (
                <button
                  key={opt}
                  className={reps === opt ? "selected" : ""}
                  onClick={() => setReps(opt)}
                  type="button"
                >
                  {opt}
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
                  value={manual}
                  onChange={(e) => setManual(e.target.value)}
                  aria-label="Manual reps input"
                />
              )}
            </div>
          </div>
        )}
        {interactive && (
          <button
            disabled={
              !markedDone &&
              (!sets || (!reps && reps !== manualLabel))
            }
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
        )}

        <style jsx>{`
          .card {
            background: #1a1a1a;
            color: #ddd;
            border-radius: 12px;
            padding: 12px 16px;
            margin-bottom: 12px;
            box-shadow: 0 3px 8px #0008;
          }
          .done {
            background: #274527;
            color: #aadeac;
            box-shadow: 0 0 10px #28c42888;
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
            margin: 8px 0;
            font-style: italic;
            opacity: 0.8;
          }
          .selectors {
            margin-top: 10px;
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
          }
          .sets, .reps {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .sets span, .reps span {
            min-width: 40px;
            font-weight: 600;
            user-select: none;
          }
          button {
            padding: 6px 12px;
            border-radius: 10px;
            background: #2a6f2a;
            border: none;
            color: white;
            font-weight: 600;
            cursor: pointer;
            user-select: none;
            transition: background-color 0.3s;
          }
          button.selected, button:hover:not(:disabled) {
            background: #38c538;
            box-shadow: 0 0 12px #38c538cc;
          }
          button:disabled {
            background: #1a3a1a;
            opacity: 0.6;
            cursor: not-allowed;
          }
          input[type="number"] {
            width: 65px;
            border-radius: 8px;
            border: 1.5px solid #38c538;
            background: #233823;
            color: #aadfaa;
            font-weight: 600;
            padding: 6px 10px;
            font-family: "Inter", sans-serif;
          }
          .mark-btn {
            width: 100%;
            margin-top: 15px;
            padding: 12px 0;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 700;
            background: #2a6f2a;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
          }
          .undo {
            background: #b33b3b;
          }
          .done-icon {
            font-size: 1.7rem;
            color: #aadeac;
            filter: drop-shadow(0 0 6px #28c428aa);
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
          color: #ddd;
          min-height: 100vh;
          overflow-x: hidden;
          padding-bottom: 72px; /* bottom nav height */
        }
        main {
          max-width: 480px;
          margin: auto;
          padding: 1rem;
        }
        header {
          padding: 0.75rem 1rem;
          font-weight: bold;
          font-size: 1.75rem;
          user-select: none;
          color: #8ce28c;
          text-align: center;
        }
        .accordion {
          margin-bottom: 1.75rem;
          background: #1f1f1f;
          border-radius: 12px;
          box-shadow: 0 3px 8px #000a;
          user-select: none;
        }
        .accordion-header {
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 700;
          font-size: 1.1rem;
          color: #8ce28c;
          cursor: pointer;
          border-bottom: 1px solid #2c3a2c;
          border-radius: 12px 12px 0 0;
        }
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          padding: 0 20px;
        }
        .accordion-content.open {
          max-height: 1000px;
          padding: 12px 20px 18px;
        }
        nav.bottom-nav {
          position: fixed;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          background: #232323;
          border-radius: 36px;
          padding: 10px 30px;
          display: flex;
          gap: 50px;
          box-shadow: 0 0 16px #333;
          z-index: 100;
          user-select: none;
        }
        nav.bottom-nav button {
          background: none;
          border: none;
          color: #8a8a8a;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          transition: color 0.3s ease;
        }
        nav.bottom-nav button.active,
        nav.bottom-nav button:hover {
          color: #8ce28c;
        }
      `}</style>

      <div>
        <header>Workout Tracker</header>
        <main>
          {tab === "today" && (
            <>
              <h2>Today's Workout ({daysOfWeek[new Date().getDay()]})</h2>
              {workoutsData[daysOfWeek[new Date().getDay()]].map((ex) => (
                <WorkoutCard key={ex.id} exercise={ex} day={daysOfWeek[new Date().getDay()]} interactive />
              ))}
            </>
          )}
          {tab === "history" && (
            <>
              <h2>Workout History</h2>
              <label htmlFor="date-filter">Filter by Date: </label>
              <input
                id="date-filter"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: "6px", border: "none", marginLeft: "8px" }}
              />
              {filterDate && (
                <button
                  style={{ marginLeft: "8px", background: "#b33b3b", borderRadius: "6px", color: "white", border: "none", padding: "6px 12px" }}
                  onClick={() => setFilterDate("")}
                >
                  Clear
                </button>
              )}
              <br />
              {Object.entries(filteredCompletions).length === 0 ? (
                <p style={{ marginTop: "1rem" }}>No workouts found for selected date.</p>
              ) : (
                Object.entries(filteredCompletions).map(([day, exs]) => (
                  <section key={day} className="accordion">
                    <header className="accordion-header" onClick={() => toggleDay(day)} tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") toggleDay(day); }}>
                      {day}
                      {expandedDays[day] ? <FaChevronUp /> : <FaChevronDown />}
                    </header>
                    <div className={`accordion-content ${expandedDays[day] ? "open" : ""}`}>
                      {Object.entries(exs).map(([id, val]) => {
                        const w = workoutsData[day]?.find((w) => w.id === Number(id));
                        return (
                          <div key={id} className="card">
                            {w?.name || "Unknown"} - Sets: {val.sets}, Reps: {val.reps}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))
              )}
            </>
          )}
          {tab === "all" && (
            <>
              <h2>All Workouts</h2>
              {daysOfWeek.map((day) => (
                <section key={day} className="accordion">
                  <header className="accordion-header" onClick={() => toggleDay(day)} tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") toggleDay(day); }}>
                    {day}
                    {expandedDays[day] ? <FaChevronUp /> : <FaChevronDown />}
                  </header>
                  <div className={`accordion-content ${expandedDays[day] ? "open" : ""}`}>
                    {(workoutsData[day] || []).map((ex) => (
                      <div key={ex.id} className="card">
                        <h4 style={{ margin: 0, marginBottom: "0.3rem" }}>{ex.name}</h4>
                        <p style={{ fontStyle: "italic", margin: 0, marginBottom: "0.7rem" }}>{ex.notes}</p>
                        <p style={{ margin: 0 }}>Sets: {ex.sets} | Reps: {Array.isArray(ex.reps) ? ex.reps.join(", ") : ex.reps}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </>
          )}
        </main>

        <nav className="bottom-nav" role="tablist" aria-label="Main Navigation">
          <button onClick={() => setTab("today")} className={tab === "today" ? "active" : ""} role="tab" aria-selected={tab === "today"}>
            <FaDumbbell size={24} />
            Today
          </button>
          <button onClick={() => setTab("history")} className={tab === "history" ? "active" : ""} role="tab" aria-selected={tab === "history"}>
            <FaHistory size={24} />
            History
          </button>
          <button onClick={() => setTab("all")} className={tab === "all" ? "active" : ""} role="tab" aria-selected={tab === "all"}>
            <FaListUl size={24} />
            All
          </button>
        </nav>
      </div>
    </>
  );
}

