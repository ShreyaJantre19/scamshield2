import React, { useState, useEffect } from "react";
import Home from "./components/Home";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div>
      <h1>ScamShield</h1>
      <p>{message}</p>
      <Home />
    </div>
  );
}

export default App;