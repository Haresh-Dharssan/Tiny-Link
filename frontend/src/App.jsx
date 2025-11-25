import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import CodeStats from "./pages/CodeStats.jsx";
import Health from "./pages/Health.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/code/:code" element={<CodeStats />} />
        <Route path="/healthz" element={<Health />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
