import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Sandbox from "./pages/Sandbox";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route index element={<Home />} />
        <Route path="/sandbox" element={<Sandbox />} />
      </Routes>
    </div>
  );
}

export default App;
