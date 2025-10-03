import { useState, useEffect } from "react";
import { FaCheckCircle, FaUndoAlt } from "react-icons/fa";

const setsOptions = [3, 4];
const repsOptions = [8, 10, 12];
const manualEntryLabel = "Manual Entry";

export default function WorkoutCard({
  day,
  exercise,
  savedCompletion,
  onCompleteToggle,
}) {
  const [selectedSets, setSelectedSets] = useState(savedCompletion?.sets || null);
  const [selectedReps, setSelectedReps] = useState(savedCompletion?.reps || null);
  const [manualReps, setManualReps] = useState("");
  const [markedDone, setMarkedDone] = useState(!!savedCompletion?.done);

  useEffect(() => {
    if (savedCompletion) {
      setSelectedSets(savedCompletion.sets);
      setSelectedReps(savedCompletion.reps);
      setMarkedDone(savedCompletion.done);
      if (savedCompletion.manualReps) setManualReps(savedCompletion.manualReps);
    }
  }, [savedCompletion]);

  function handleMarkDone() {
    if (!markedDone && selectedSets && (selectedReps || manualReps)) {
      onCompleteToggle(day, exercise.id, {
        done: true,
        sets: selectedSets,
        reps: selectedReps === manualEntryLabel ? manualReps : selectedReps,
        manualReps: selectedReps === manualEntryLabel ? manualReps : null,
        timestamp: new Date().toISOString(),
      });
      setMarkedDone(true);
    } else {
      // Undo done
      onCompleteToggle(day, exercise.id, null);
      setMarkedDone(false);
    }
  }

  return (
    <div className={`card ${markedDone ? "done" : ""}`}>
      <div className="header">
        <h3>{exercise.name}</h3>
        <p className="notes">{exercise.notes}</p>
      </div>

      {!markedDone && (
        <div className="selectors">
          <div className="sets-group">
            <span>Sets:</span>
            {setsOptions.map((s) => (
              <button
                key={s}
                className={selectedSets === s ? "selected" : ""}
                onClick={() => setSelectedSets(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="reps-group">
            <span>Reps:</span>
            {repsOptions.map((r) => (
              <button
                key={r}
                className={selectedReps === r ? "selected" : ""}
                onClick={() => setSelectedReps(r)}
              >
                {r}
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
        className={`mark-done-btn ${markedDone ? "undo" : "done"}`}
        disabled={!markedDone && (!selectedSets || (!selectedReps && selectedReps !== manualEntryLabel))}
        onClick={handleMarkDone}
      >
        {markedDone ? <><FaUndoAlt /> Undo</> : <><FaCheckCircle /> Mark Done</>}
      </button>

      <style jsx>{`
        .card {
          background-color: #013220;
          border-radius: 12px;
          box-shadow: 0 0 10px #014d40cc;
          color: #e0f2f1;
          padding: 16px;
          margin: 12px 0;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }
        .card.done {
          background-color: #026b58;
          box-shadow: 0 0 20px #26a69a;
        }
        .header h3 {
          margin: 0 0 8px 0;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
        }
        .notes {
          font-size: 0.8rem;
          font-style: italic;
          margin-bottom: 12px;
        }
        .selectors {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .sets-group,
        .reps-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        span {
          font-weight: 600;
        }
        button {
          background: #014d40;
          border: none;
          color: #e0f2f1;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          font-family: 'Inter', sans-serif;
        }
        button.selected {
          background-color: #26a69a;
          box-shadow: 0 0 8px #26a69acc;
          font-weight: 700;
        }
        button:hover:not(:disabled) {
          background-color: #26a69a;
        }
        input {
          width: 60px;
          padding: 6px 8px;
          border-radius: 8px;
          border: 1px solid #26a69a;
          font-family: 'Inter', sans-serif;
        }
        .mark-done-btn {
          width: 100%;
          font-size: 1rem;
          font-weight: 700;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
          padding: 10px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          user-select: none;
          background-color: #26a69a;
          color: #013220;
          transition: background-color 0.3s ease;
        }
        .mark-done-btn.undo {
          background-color: #cc4c4c;
          color: #f7dedf;
        }
        .mark-done-btn:disabled {
          background-color: #014d4050;
          cursor: not-allowed;
          color: #94d4cc;
        }
      `}</style>
    </div>
  );
}

