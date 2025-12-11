import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginPage from "./LoginPage.js";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LoginPage} />
      </Switch>
    </Router>
  );
}

export default App;
