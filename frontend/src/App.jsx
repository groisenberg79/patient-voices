import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DiseasePage from "./pages/DiseasePage";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/disease/:id" element={<DiseasePage />} />
      </Routes>
    </Router>
  );
}

export default App;
