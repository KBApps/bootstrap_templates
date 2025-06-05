import React from "react";
import { app } from "./firebaseConfig";

function App() {
  return (
    <div>
      <h1>React + Firebase Template</h1>
      <p>Firebase App Name: {app.name}</p>
    </div>
  );
}

export default App;
