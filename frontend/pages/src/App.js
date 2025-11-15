import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import ExamplePage from "./example_page";
import ForgotPage from "./forgot";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/example" element={<ExamplePage />} />
        <Route path="/forgot" element={<ForgotPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
