import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import NavigationBar from "./Componenets/Navbar/Nav";
import About from "./pages/About";
import PrivetRoute from "./Componenets/PrivetRoue";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <div className="app">
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<PrivetRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/signin" element={<Signin />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
};

export default App;
