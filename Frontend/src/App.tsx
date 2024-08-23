import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import {
  GcdsHeader,
  GcdsTopNav,
  GcdsNavLink,
} from "@cdssnc/gcds-components-react";
import Dashboard from "./pages/Dashboard";
import Registration from "./pages/Registration";
import CustodianAssets from "./pages/CustodianAssets";
import MainTemplate from "./templates/MainTemplate";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/custodian-dashboard" element={<CustodianAssets />} />
      </Routes>
    </Router>
  );
}

function Home() {
  return (
    <div className="App">
      <MainTemplate addMargins={false}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </MainTemplate>
    </div>
  );
}

export default App;
