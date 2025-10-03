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
    { id: 1, name: "Chest Press Machine", sets: 4, reps: [8, 10, 12], notes: "Primary Compound Lift" },
    { id: 2, name: "Shoulder Press Machine", sets: 3, reps: [8, 10, 12], notes: "Controlled descent" },
    { id: 3, name: "Pec Fly Machine", sets: 3, reps: [12, 15], notes: "Focus on squeeze" },
    { id: 4, name: "Lateral Raise Machine", sets: 3, reps: [12, 15], notes: "Strict, slow movement" },
    { id: 5, name: "Triceps Extension", sets: 3, reps: [12, 15], notes: "Full contraction" },
    { id: 6, name: "Abdominal Machine", sets: 3, reps: [15, 20], notes: "Slow, controlled crunch" },
  ],
  /* include all days as per your original data */
  Tuesday: [/*...*/],
  Wednesday: [/*...*/],
  Thursday: [/*...*/],
  Friday: [/*...*/],
  Saturday: [/*...*/],
  Sunday: [/*...*/],
};

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const setsOptions = [3, 4];
const repsOptions = [8, 10, 12];
const manualLabel = "Manual";

export default function WorkoutApp() {
  const [tab, setTab] = useState('today');
  const [completions, setCompletions] = useState({});
  const [filterDate, setFilterDate] = useState('');
  const [expandedDays, setExpandedDays] = useState({});

  const today = daysOfWeek[new Date().getDay()];
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('workoutCompletions');
      if (stored) setCompletions(JSON.parse(stored));
    }
    document.body.classList.add('dark');
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('workoutCompletions', JSON.stringify(completions));
  }, [completions]);

  const toggleDay = (day) => {
    setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const saveCompletion = (day, id, data) => {
    setCompletions(prev => {
      const dayData = { ...(prev[day] || {}) };
      if (data) dayData[id] = data;
      else delete dayData[id];
      return { ...prev, [day]: dayData };
    });
  };

  const getCompletedWorkoutsByDate = (date) => {
    if (!date) return completions;
    const result = {};
    for (const [day, exs] of Object.entries(completions)) {
      for (const [id, val] of Object.entries(exs)) {
        if (val.timestamp?.startsWith(date)) {
          if (!result[day]) result[day] = {};
          result[day][id] = val;
        }
      }
    }
    return result;
  };

  const filteredCompletions = getCompletedWorkoutsByDate(filterDate);

  function WorkoutCard({ exercise, day, interactive }) {
    const stored = completions?.[day]?.[exercise.id] || {};
    const [sets, setSets] = useState(stored.sets || null);
    const [reps, setReps] = useState(stored.reps || null);
    const [manual, setManual] = useState(stored.manual || '');
    const [done, setDone] = useState(stored.done || false);

    const inputRef = useRef(null);

    useEffect(() => {
      if (reps === manualLabel && inputRef.current) inputRef.current.focus();
    }, [reps]);

    const handleMark = () => {
      if (!done && sets && (reps || reps === 0)) {
        const repToStore = reps === manualLabel ? manual : reps;
        if (!repToStore) return alert('Please enter the number of reps.');
        saveCompletion(day, exercise.id, {
          sets,
          reps: repToStore,
          manual: reps === manualLabel ? manual : null,
          done: true,
          timestamp: new Date().toISOString()
        });
        setDone(true);
      } else {
        saveCompletion(day, exercise.id, null);
        setDone(false);
      }
    };

    return (
      <div className={`card${done ? ' done' : ''}`}>
        <div className="card-header">
          <h4>{exercise.name}</h4>
          {done && <FaCheckCircle className="done-icon" />}
        </div>
        <p className="notes">{exercise.notes}</p>
        {interactive && !done && (
          <>
            <div className="selectors">
              <div className="sets">
                <span>Sets:</span>
                {setsOptions.map(opt => (
                  <button key={opt} className={sets === opt ? 'selected' : ''} onClick={() => setSets(opt)}>{opt}</button>
                ))}
              </div>
              <div className="reps">
                <span>Reps:</span>
                {repsOptions.map(opt => (
                  <button key={opt} className={reps === opt ? 'selected' : ''} onClick={() => setReps(opt)}>{opt}</button>
                ))}
                <button className={reps === manualLabel ? 'selected' : ''} onClick={() => setReps(manualLabel)}>{manualLabel}</button>
                {reps === manualLabel && (
                  <input
                    ref={inputRef}
                    type="number"
                    min="1"
                    value={manual}
                    onChange={(e) => setManual(e.target.value)}
                    placeholder="Enter reps"
                    aria-label="Enter custom reps"
                  />
                )}
              </div>
            </div>
            <button
              disabled={!sets || (reps === null) || (reps === manualLabel && manual === '')}
              onClick={handleMark}
              className="mark-btn"
            >
              Mark Done
            </button>
          </>
        )}
        {interactive && done && (
          <button onClick={handleMark} className="mark-btn undo">Undo</button>
        )}
        <style jsx>{`
          .card {
            background: #121a17;
            border-radius: 16px;
            padding: 16px;
            margin-bottom: 16px;
            color: #ddd;
            box-shadow: 0 0 16px rgb(0 0 0 / 0.3);
            transition: background 0.3s;
          }
          .done {
            background: #2f5f4f;
            box-shadow: 0 0 18px #3da84d;
            color: #abddaa;
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
          }
          .selectors {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
            margin-bottom: 12px;
          }
          .sets,
          .reps {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          span {
            min-width: 40px;
            font-weight: 600;
            user-select: none;
          }
          button {
            background: #2d6e50;
            border: none;
            color: white;
            padding: 6px 12px;
            border-radius: 8px;
            cursor: pointer;
            user-select: none;
            font-weight: 600;
            transition: background 0.3s;
          }
          button.selected,
          button:hover:not(:disabled) {
            background: #3fb974;
            box-shadow: 0 0 12px #3fb974aa;
          }
          button:disabled {
            background: #194321;
            cursor: not-allowed;
            opacity: 0.5;
          }
          input[type='number'] {
            width: 60px;
            border-radius: 8px;
            border: 1.5px solid #3fb974;
            background: #254527;
            color: #aee9a9;
            padding: 6px 10px;
            font-weight: 600;
            font-family: 'Inter', sans-serif;
          }
          .mark-btn {
            width: 100%;
            padding: 14px 0;
            border-radius: 30px;
            font-size: 1.1rem;
            font-weight: 700;
            background: #286d4b;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
          }
          .undo {
            background: #ad3939;
          }
          .done-icon {
            color: #abddaa;
            font-size: 24px;
            filter: drop-shadow(0 0 5px #3da84d);
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
          background: #121a17;
          color: #ddd;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          overflow-x: hidden;
          min-height: 100vh;
          padding-bottom: 72px;
          transition: background 0.3s, color 0.3s;
        }

        * {
          box-sizing: border-box;
        }

        main {
          max-width: 480px;
          margin: 0 auto;
          padding: 1rem;
        }

        header {
          font-size: 1.8rem;
          font-weight: 800;
          padding: 1rem 0;
          text-align: center;
          color: #6cb56d;
          user-select: none;
        }

        nav.bottom-nav {
          position: fixed;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          background: #233522;
          border-radius: 36px;
          padding: 10px 30px;
          display: flex;
          gap: 60px;
          box-shadow: 0 3px 12px rgb(17 41 16 / 90%);
          z-index: 1000;
          user-select: none;
        }

        nav.bottom-nav button {
          flex-grow: 1;
          background: none;
          border: none;
          color: #7caa82;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: color 0.3s;
        }
        nav.bottom-nav button:hover,
        nav.bottom-nav button:focus-visible {
          color: #a3cc9a;
          outline: none;
        }
        nav.bottom-nav button.active {
          color: #a3cc9a;
          font-weight: 700;
        }

        .accordion {
          background: #223322;
          border-radius: 14px;
          box-shadow: 0 4px 8px rgb(0 0 0 / 0.6);
          margin-bottom: 20px;
          user-select: none;
        }
        .accordion-header {
          padding: 14px 22px;
          font-size: 1.1rem;
          font-weight: 700;
          color: #a3cc9a;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #2c4c2c;
          border-radius: 14px 14px 0 0;
        }
        .accordion-content {
          padding: 0 22px;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.35s ease;
        }
        .accordion-content.expanded {
          max-height: 800px;
          padding-top: 14px;
          padding-bottom: 20px;
        }

        /* utility classes and utilities left for brevity */
      `}</style>

      <div>
        <header>Workout Tracker</header>

        <main>
          {tab === 'today' && (
            <>
              <h2>{today}'s Workout</h2>
              {workoutsData[today].map(ex => (
                <WorkoutCard key={ex.id} exercise={ex} day={today} interactive />
              ))}
            </>
          )}

          {tab === 'history' && (
            <>
              <h2>History</h2>
              <label htmlFor="filter-date" style={{ display: 'block', marginBottom: '10px' }}>
                Filter by Date
                <input id="filter-date" type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{ marginLeft: '10px' }} />
                {filterDate && <button onClick={() => setFilterDate('')} style={{ marginLeft: '10px' }}>Clear</button>}
              </label>
              {!filterDate && <p>Please select a date to see history</p>}
              {filterDate && Object.keys(filteredCompletions).length === 0 && <p>No workouts found on this date</p>}
              {filterDate && Object.entries(filteredCompletions).map(([day, exs]) => (
                <Accordion key={day} day={day} expanded={expandedDays[day]} toggle={toggleDay}>
                  {Object.entries(exs).map(([id, val]) => {
                    const w = workoutsData[day].find(e => e.id === Number(id));
                    return (
                      <div key={id} className="card" style={{ marginBottom: '10px' }}>
                        <strong>{w?.name ?? 'Unknown Exercise'}</strong> — Sets: {val.sets}, Reps: {val.reps}
                      </div>
                    );
                  })}
                </Accordion>
              ))}
            </>
          )}

          {tab === 'all' && (
            <>
              <h2>All Workouts</h2>
              {daysOfWeek.map(d => (
                <Accordion key={d} day={d} expanded={expandedDays[d]} toggle={toggleDay}>
                  {workoutsData[d].map(ex => (
                    <div key={ex.id} className="card" style={{ marginBottom: '10px' }}>
                      <h3 style={{ marginBottom: '5px' }}>{ex.name}</h3>
                      <p style={{ fontStyle: 'italic', marginBottom: '5px' }}>{ex.notes}</p>
                      <p>Sets: {ex.sets} — Reps: {Array.isArray(ex.reps) ? ex.reps.join(', ') : ex.reps}</p>
                    </div>
                  ))}
                </Accordion>
              ))}
            </>
          )}
        </main>

        <nav className="bottom-nav" role="tablist" aria-label="Main Navigation">
          <button onClick={() => setTab('today')} className={tab === 'today' ? 'active' : ''} role="tab" aria-selected={tab === 'today'}>
            <FaDumbbell />
            Today
          </button>
          <button onClick={() => setTab('history')} className={tab === 'history' ? 'active' : ''} role="tab" aria-selected={tab === 'history'}>
            <FaHistory />
            History
          </button>
          <button onClick={() => setTab('all')} className={tab === 'all' ? 'active' : ''} role="tab" aria-selected={tab === 'all'}>
            <FaListUl />
            All
          </button>
        </nav>
      </div>
    </>
  );
}
