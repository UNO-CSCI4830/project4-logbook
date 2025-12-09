import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage.js";
import ExamplePage from "./example_page.js";
import ForgotPage from "./forgot.js";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/example" element={<ExamplePage />} />
        <Route path="/forgot" element={<ForgotPage />} />
      </Routes>
    </Router>
  );
}

export default App;
