import React from "react";
import Gol from "./components/gol";
import Rules from "./components/rules";
import "./App.css";

function App() {
    return (
        <div className={"container"}>
            <h1>Conway's Game of Life</h1>
            <div className={"content"}>
                <Gol/>
                <Rules/>
            </div>
        </div>
    )
}
export default App;