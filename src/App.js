import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Reset from './Components/Reset/Reset';
import Dashboard from './Components/Dashboard/Dashboard';
import CreateView from './Components/Create';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
        <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/reset" component={Reset} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/dashboard/create" component={CreateView} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
