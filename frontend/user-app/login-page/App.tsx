import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage.js";
import ExamplePage from "./example_page.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/example" element={<ExamplePage />} />
      </Routes>
    </Router>
  );
}

export default App;
