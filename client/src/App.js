import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Sandbox from "./pages/Sandbox";
import SignIn from "./pages/SignIn";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route index element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/sandbox" element={<Sandbox />} />
      </Routes>
    </div>
  );
}

export default App;
