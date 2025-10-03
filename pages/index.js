// File: pages/index.js

import { useState, useEffect } from "react";

const workouts = {
  Monday: [
    {
      id: 1,
      name: "Chest Press Machine",
      sets: 4,
      reps: [8, 10, 12],
      notes: "Stability and progressive overload",
    },
    {
      id: 2,
      name: "Shoulder Press Machine",
      sets: 3,
      reps: [8, 10, 12],
      notes: "Control the weight going down",
    },
    {
      id: 3,
      name: "Pec Fly Machine",
      sets: 3,
      reps: [12, 15],
      notes: "Focus on squeezing the chest.",
    },
    {
      id: 4,
      name: "Lateral Raise Machine",
      sets: 3,
      reps: [12, 15],
      notes: "Strict form.",
    },
    {
      id: 5,
      name: "Triceps Extension Machine",
      sets: 3,
      reps: [12, 15],
      notes: "Full contraction at the bottom.",
    },
    {
      id: 6,
      name: "Abdominal Machine",
      sets: 3,
      reps: [15, 20],
      notes: "Slow controlled crunch.",
    },
  ],
  Tuesday: [
    {
      id: 7,
      name: "Seated Leg Press",
      sets: 4,
      reps: [10, 12],
      notes: "Full range of motion",
    },
    {
      id: 8,
      name: "Leg Extension Machine",
      sets: 3,
      reps: [12, 15],
      notes: "Slow controlled squeeze",
    },
    {
      id: 9,
      name: "Seated Leg Curl Machine",
      sets: 3,
      reps: [12, 15],
      notes: "Focus on lowering phase",
    },
    {
      id: 10,
      name: "Hip Adduction Machine",
      sets: 3,
      reps: [15, 20],
      notes: "Inner thigh and glute squeeze",
    },
    {
      id: 11,
      name: "Glute Extension Machine",
      sets: 3,
      reps: [12, 15],
      notes: "Squeeze glute hard",
    },
    {
      id: 12,
      name: "Calf Extension Machine",
      sets: 3,
      reps: [15, 20],
      notes: "Full stretch and squeeze",
    },
  ],
  // Add other days' workouts similarly...
};

export default function Home() {
  const [day, setDay] = useState("Monday");
  const [completions, setCompletions] = useState({});

  useEffect(() => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = new Date().getDay();
    setDay(days[today]);
  }, []);

  const markDone = (id, setCount, repCount) => {
    setCompletions((prev) => ({ ...prev, [id]: { sets: setCount, reps: repCount } }));
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Workout for {day}</h1>
      {!workouts[day] ? (
        <p>Rest or Cardio day - no machine exercises scheduled</p>
      ) : (
        workouts[day].map((exercise) => (
          <div
            key={exercise.id}
            style={{
              marginBottom: 20,
              border: "1px solid #ccc",
              padding: 10,
              borderRadius: 5,
            }}
          >
            <h2>{exercise.name}</h2>
            <p>{exercise.notes}</p>
            <label>
              Sets:{" "}
              <select
                onChange={(e) =>
                  markDone(
                    exercise.id,
                    parseInt(e.target.value),
                    completions[exercise.id]?.reps || exercise.reps[0]
                  )
                }
                value={completions[exercise.id]?.sets || ""}
              >
                <option value={""}>Select sets</option>
                {[3, 4].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>{" "}
            <label>
              Reps:{" "}
              <select
                onChange={(e) =>
                  markDone(
                    exercise.id,
                    completions[exercise.id]?.sets || exercise.sets,
                    e.target.value === "manual"
                      ? ""
                      : parseInt(e.target.value)
                  )
                }
                value={completions[exercise.id]?.reps || ""}
              >
                <option value={""}>Select reps</option>
                {exercise.reps.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
                <option value={"manual"}>Manual Entry</option>
              </select>
            </label>
          </div>
        ))
      )}
      <hr />
      <h3>Completed Exercises</h3>
      <ul>
        {Object.keys(completions).length === 0 && <li>No exercises completed yet.</li>}
        {Object.entries(completions).map(([id, val]) => {
          const workout = Object.values(workouts)
            .flat()
            .find((ex) => ex.id === parseInt(id));
          return (
            <li key={id}>
              {workout?.name} - Sets: {val.sets} Reps: {val.reps}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
