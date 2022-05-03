import React from "react";
import { Route, Routes } from "react-router-dom";
import Sandbox from "./pages/Sandbox";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route index element={<Sandbox />} />
      </Routes>
    </div>
  );
}

export default App;
