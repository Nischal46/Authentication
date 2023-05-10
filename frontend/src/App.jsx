import Login from "./Component/Login";
import Register from "./Component/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Component/Dashboard";
import Resetemail from "./Component/Resetemail";
import Changepass from "./Component/Changepass";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgotpass" element={<Resetemail />} />
        <Route path="/changepass/:id" element={<Changepass />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
