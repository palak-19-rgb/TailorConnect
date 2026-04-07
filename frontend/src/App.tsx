import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./auth/Hero";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import TailorDashboard from "./Tailor/TailorDash";
import CustomerDashboard from "./Customer/CustomerDash";
import Chat from "./pages/Chat";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
   <Route path="/TailorDash/*" element={<TailorDashboard />} />
<Route path="/CustomerDash/*" element={<CustomerDashboard />} />
<Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;