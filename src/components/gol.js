import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import './gol.css';

const numRows = 25
const numCols = 25
const operations = 
[
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
]

const generateEmptyGrid = () => {
  const rows = []

  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0))
  }
  return rows
}

export default function Gol() {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid()
  })

  const [sum, setSum] = useState(0)
  const [genZ, setGenZ] = useState(0)
  const timmyRef = useRef(300)
  const [running, setRunning] = useState(false)
  const runningRef = useRef(running)
  runningRef.current = running

  const runSim = useCallback(() => {
    if (!runningRef.current) {
      return
    }
    setGrid((g) => {
      let isGrid = false
      isGrid = false
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0
            operations.forEach(([x, y]) => {
              const newI = i + x
              const newJ = j + y
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ]
              }
            })

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0
            } else if (g[i][j] === 0 && neighbors === 3) {
              isGrid = true
              gridCopy[i][j] = 1
            }
          }
        }

        if (isGrid) {
          setGenZ((num) => num + 1)
        }

        setSum(
          gridCopy.flat().reduce((gpp, pp) => {
            return gpp + pp
        })
        )
      })
    })
    setTimeout(runSim, timmyRef.current)
  }, [])

    return (
        <div>
            <div className='info-container'>
                <div className='data'>
                    <p>Generation: {genZ}</p>
                    <p>Population: {sum}</p>
                </div>
            </div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${numCols}, 20px)`
                }}
            >
                {grid.map((rows, i) =>
                    rows.map((col, k) => (
                        <div
                            key={`${i}-${k}`}
                            onClick={() => {
                                const newGrid = produce(grid, gridCopy => {
                                    gridCopy[i][k] = grid[i][k] ? 0 : 1;
                                });
                                setGrid(newGrid);
                            }}
                            style={{
                                width: 20,
                                height: 20,
                                backgroundColor: grid[i][k] ? "black" : undefined,
                                border: "solid 1px black"
                            }}
                        />
                    ))
                )}
            </div>
            <div className={"buttons"}>
                <button
                    onClick={() => {
                        setRunning(!running);
                        if (!running) {
                            runningRef.current = true;
                            runSim();
                        }
                    }}>
                    {running ? "stop" : "start"}
                </button>
                <button
                    onClick={() => {
                        const rows = [];
                        for (let i = 0; i < numRows; i++) {
                            rows.push(
                                Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
                            );
                        }
                        setGrid(rows);
                    }}>
                    random
                </button>
                <button
                    onClick={() => {
                        setGrid(generateEmptyGrid());
                    }}>
                    clear
                </button>
                <button
            onClick={() => {
              timmyRef.current = 5
            }}>
            Speed Up
          </button>
          <button
            onClick={() => {
              timmyRef.current = 300
            }}>
            Normal
          </button>
          <button
            onClick={() => {
              timmyRef.current = 800
            }}>
            Slow Down
          </button>
            </div>
        </div>
    )
}