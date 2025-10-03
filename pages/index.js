import { useState, useEffect } from "react";
import { FaDumbbell, FaHistory, FaListUl, FaCheckCircle, FaUndoAlt } from "react-icons/fa";

// Your workout data parsed roughly from Excel (sample)
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
    { id: 7, name: "Seated Leg Press", sets: 4, reps: [10, 12], notes: "Full range of motion", caloriesPerSet: 9 },
    { id: 8, name: "Leg Extension Machine", sets: 3, reps: [12, 15], notes: "Slow controlled squeeze", caloriesPerSet: 8 },
    { id: 9, name: "Seated Leg Curl Machine", sets: 3, reps: [12, 15], notes: "Focus on negative phase", caloriesPerSet: 8 },
    { id: 10, name: "Hip Adduction Machine", sets: 3, reps: [15, 20], notes: "Inner thigh and glute squeeze", caloriesPerSet: 6 },
    { id: 11, name: "Glute Extension Machine", sets: 3, reps: [12, 15], notes: "Squeeze glute hard", caloriesPerSet: 7 },
    { id: 12, name: "Calf Extension Machine", sets: 3, reps: [15, 20], notes: "Full stretch and squeeze", caloriesPerSet: 5 },
  ],
  // Add other days similarly...
};
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const getToday = () => daysOfWeek[new Date().getDay()];

const setsOptions = [3, 4];
const repsOptions = [8, 10, 12];
const manualEntryLabel = "Manual Entry";

export default function Home() {
  const [currentTab, setCurrentTab] = useState("today");
  const [completions, setCompletions] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("workoutCompletions");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [filterDate, setFilterDate] = useState("");
  const today = getToday();

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("workoutCompletions", JSON.stringify(completions));
  }, [completions]);

  function saveCompletion(day, exerciseId, data) {
    setCompletions((prev) => {
      const dayData = prev[day] || {};
      if (data === null) {
        delete dayData[exerciseId];
      } else {
        dayData[exerciseId] = data;
      }
      return { ...prev, [day]: dayData };
    });
  }

  function completedWorkoutsForDate(date) {
    if (!date) return {};
    // Return exercises completed on given date
    return Object.entries(completions).reduce((res, [day, exs]) => {
      Object.entries(exs).forEach(([exId, val]) => {
        if (val.timestamp && val.timestamp.startsWith(date)) {
          if (!res[day]) res[day] = {};
          res[day][exId] = val;
        }
      });
      return res;
    }, {});
  }

  const completionForFilteredDate = filterDate ? completedWorkoutsForDate(filterDate) : {};

  const WorkoutCard = ({ day, exercise }) => {
    const saved = completions[day]?.[exercise.id];
    const savedFiltered = completionForFilteredDate[day]?.[exercise.id];
    const [selectedSets, setSelectedSets] = useState(saved?.sets || null);
    const [selectedReps, setSelectedReps] = useState(saved?.reps || null);
    const [manualReps, setManualReps] = useState(saved?.manualReps || "");
    const [markedDone, setMarkedDone] = useState(!!saved?.done);

    useEffect(() => {
      setSelectedSets(saved?.sets || null);
      setSelectedReps(saved?.reps || null);
      setManualReps(saved?.manualReps || "");
      setMarkedDone(!!saved?.done);
    }, [saved]);

    function markDone() {
      if (!markedDone && selectedSets && (selectedReps || selectedReps === 0)) {
        saveCompletion(day, exercise.id, {
          done: true,
          sets: selectedSets,
          reps: selectedReps === manualEntryLabel ? manualReps : selectedReps,
          manualReps: selectedReps === manualEntryLabel ? manualReps : null,
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
          <h3>{exercise.name}</h3>
          {markedDone && <FaCheckCircle className="done-icon" />}
        </div>
        <p className="notes">{exercise.notes}</p>
        {!markedDone && (
          <div className="select-group">
            <div className="sets-group">
              <span>Sets:</span>
              {setsOptions.map((opt) => (
                <button
                  key={opt}
                  className={selectedSets === opt ? "selected" : ""}
                  onClick={() => setSelectedSets(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="reps-group">
              <span>Reps:</span>
              {repsOptions.map((opt) => (
                <button
                  key={opt}
                  className={selectedReps === opt ? "selected" : ""}
                  onClick={() => setSelectedReps(opt)}
                >
                  {opt}
                </button>
              ))}
              <button
                onClick={() => setSelectedReps(manualEntryLabel)}
                className={selectedReps === manualEntryLabel ? "selected" : ""}
              >
                {manualEntryLabel}
              </button>
              {selectedReps === manualEntryLabel && (
                <input
                  type="number"
                  min="1"
                  placeholder="Enter reps"
                  value={manualReps}
                  onChange={(e) => setManualReps(e.target.value)}
                />
              )}
            </div>
          </div>
        )}
        <button
          disabled={!markedDone && (!selectedSets || (!selectedReps && selectedReps !== manualEntryLabel))}
          className={`mark-btn ${markedDone ? "undo" : ""}`}
          onClick={markDone}
        >
          {markedDone ? <><FaUndoAlt /> Undo</> : <><FaCheckCircle /> Mark Done</>}
        </button>

        <style jsx>{`
          .card {
            background: #013220;
            border-radius: 16px;
            padding: 14px;
            margin-bottom: 16px;
            box-shadow: 0 0 10px #014d4010;
            color: #e0f2f1;
            transition: box-shadow 0.3s ease;
          }
          .card.done {
            background: #026b5833;
            box-shadow: 0 0 20px #26a69aaa;
          }
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          h3 {
            margin: 0 0 8px 0;
          }
          .notes {
            font-style: italic;
            margin-bottom: 10px;
            opacity: 0.8;
          }
          .select-group {
            display: flex;
            gap: 12px;
            margin-bottom: 14px;
            flex-wrap: wrap;
          }
          .sets-group, .reps-group {
            display: flex;
            align-items: center;
            gap: 6px;
          }
          span {
            font-weight: 700;
          }
          button {
            border: none;
            padding: 8px 14px;
            border-radius: 12px;
            background-color: #014d40;
            color: #e0f2f1;
            cursor: pointer;
            font-weight: 600;
            transition: background-color 0.3s ease;
            user-select: none;
          }
          button.selected, button:hover:not(:disabled) {
            background-color: #26a69a;
            color: #013220;
            box-shadow: 0 0 8px #26a69a88;
          }
          input {
            width: 70px;
            border-radius: 10px;
            border: 1.5px solid #26a69a;
            padding: 4px 8px;
            font-weight: 600;
            font-family: 'Inter', sans-serif;
          }
          .mark-btn {
            width: 100%;
            padding: 10px;
            border-radius: 20px;
            background-color: #26a69a;
            color: #013220;
            font-weight: 700;
            font-size: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            user-select: none;
            transition: background-color 0.3s ease;
          }
          .mark-btn[disabled] {
            background-color: #014d40aa;
            cursor: not-allowed;
            color: #94d4cc;
          }
          .mark-btn.undo {
            background-color: #cc4c4c;
            color: #f7dedf;
          }
          .done-icon {
            color: #48bb78;
            font-size: 22px;
            filter: drop-shadow(0 0 3px #48bb78cc);
          }
        `}</style>
      </div>
    );
  };

  const filteredCompletion = filterDate ? completedWorkoutsForDate(filterDate) : completions;

  return (
    <div className="container">
      <header>
        <h1>Workout Tracker</h1>
        <p>Deep Sea Green Theme with Inter Font</p>
      </header>

      <nav>
        <button className={currentTab === "today" ? "active" : ""} onClick={() => setCurrentTab("today")}><FaDumbbell /> Today</button>
        <button className={currentTab === "history" ? "active" : ""} onClick={() => setCurrentTab("history")}><FaHistory /> History</button>
        <button className={currentTab === "all" ? "active" : ""} onClick={() => setCurrentTab("all")}><FaListUl /> All Workouts</button>
      </nav>

      <main>
        {currentTab === "today" && (
          <>
            <h2>{today}'s Workout</h2>
            {(workoutsData[today] || []).length === 0 && <p>No workouts today.</p>}
            {(workoutsData[today] || []).map((exercise) => (
              <WorkoutCard key={exercise.id} day={today} exercise={exercise} savedCompletion={completions[today]?.[exercise.id]} onCompleteToggle={saveCompletion} />
            ))}
          </>
        )}

        {currentTab === "history" && (
          <>
            <h2>Workout History</h2>
            <div className="filter-date">
              <label htmlFor="filter-date">Filter by date: </label>
              <input type="date" id="filter-date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
              {filterDate && <button onClick={() => setFilterDate("")}>Clear</button>}
            </div>
            {!filterDate && Object.keys(completions).length === 0 && <p>No workout records yet.</p>}

            {/* Show history filtered by calendar if date selected */}
            {filterDate ? (
              Object.entries(filteredCompletion).map(([day, exercises]) => (
                <div key={day} className="history-day">
                  <h3>{day}</h3>
                  <ul>
                    {Object.entries(exercises).map(([exId, val]) => {
                      const ex = (workoutsData[day] || []).find((w) => w.id === parseInt(exId));
                      if (!ex) return null;
                      return <li key={exId}>{ex.name} - Sets: {val.sets}, Reps: {val.reps}</li>;
                    })}
                  </ul>
                </div>
              ))
            ) : (
              <p>Select a date to see workouts completed on that day.</p>
            )}
          </>
        )}

        {currentTab === "all" && (
          <>
            <h2>All Workouts</h2>
            {daysOfWeek.map((day) => (
              <section key={day}>
                <h3>{day}</h3>
                {(workoutsData[day] || []).length === 0 && <p>No workouts planned.</p>}
                {(workoutsData[day] || []).map((exercise) => (
                  <WorkoutCard key={exercise.id} day={day} exercise={exercise} savedCompletion={completions[day]?.[exercise.id]} onCompleteToggle={saveCompletion} />
                ))}
              </section>
            ))}
          </>
        )}
      </main>

      <style jsx>{`
        .container {
          max-width: 480px;
          margin: auto;
          background: #013220;
          color: #e0f2f1;
          font-family: "Inter", sans-serif;
          min-height: 100vh;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 0 20px #014d401f;
        }
        header h1 {
          margin: 0;
          font-weight: 800;
          font-size: 1.8rem;
          letter-spacing: 1px;
          text-align: center;
          margin-bottom: 5px;
          color: #26a69a;
        }
        header p {
          text-align: center;
          margin-top: 0;
          margin-bottom: 20px;
          font-style: italic;
          opacity: 0.7;
          font-weight: 600;
        }
        nav {
          display: flex;
          justify-content: space-around;
          margin-bottom: 20px;
          gap: 10px;
        }
        nav button {
          flex: 1;
          background: #014d40;
          border: none;
          padding: 10px 0;
          color: #e0f2f1;
          font-weight: 700;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: center;
          user-select: none;
          transition: background-color 0.3s ease;
        }
        nav button:hover:not(.active) {
          background: #026b58;
        }
        nav button.active {
          background: #26a69a;
          color: #013220;
          box-shadow: 0 0 15px #26a69aaa;
          transform: scale(1.05);
        }
        main h2 {
          margin-top: 0;
          font-weight: 700;
          border-bottom: 1px solid #26a69a44;
          padding-bottom: 6px;
          margin-bottom: 20px;
          font-size: 1.4rem;
        }
        main section {
          margin-bottom: 30px;
        }
        .filter-date {
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .filter-date input[type="date"] {
          padding: 6px 8px;
          border-radius: 8px;
          border: 1.5px solid #26a69a;
          background-color: #014d40;
          color: #e0f2f1;
          cursor: pointer;
          font-size: 1rem;
          user-select: none;
        }
        .filter-date button {
          background: #cc4c4c;
          border: none;
          padding: 6px 12px;
          color: #f7dedf;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
          user-select: none;
          transition: background-color 0.3s ease;
        }
        .filter-date button:hover {
          background: #aa3b3b;
        }
        .history-day ul {
          padding-left: 20px;
          margin-top: 6px;
          color: #94d4cc;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
