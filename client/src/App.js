import React from "react";
import { Route, Routes } from "react-router-dom";
import Game from "./pages/Game";
import Home from "./pages/Home";
import Sandbox from "./pages/Sandbox";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ViewerTest from "./pages/ViewerTest";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route index element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/sandbox" element={<Sandbox />} />
        <Route path="/game" element={<Game />} />
        <Route path="/vt" element={<ViewerTest />} />
      </Routes>
    </div>
  );
}

export default App;
