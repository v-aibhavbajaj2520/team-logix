import { BrowserRouter as Router ,Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to My Web App</h1>
      <p className="text-gray-600 mt-2">Your interactive web application is ready!</p>
      <Router>
      <div className="mt-5 flex gap-4">
        <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
        <Link to="/login" className="btn btn-secondary">Login</Link>
      </div>
      
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      </Router>
    </div>
  );
}
