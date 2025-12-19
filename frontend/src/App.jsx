import React from "react";
import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgottonPassword from "./pages/ForgottonPassword";

export const url = "http://localhost:8000";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgotpassword" element={<ForgottonPassword />} />
      </Routes>
    </>
  );
};

export default App;
