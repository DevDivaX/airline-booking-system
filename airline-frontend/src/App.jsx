import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Bookings from "./pages/Bookings";

function Checkin() {
  return (
    <div className="text-center mt-20 text-2xl">
      🛫 Check-in Page (Coming Soon)
    </div>
  );
}

export default function App() {
  return (
    <div>

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-10 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-600">✈ AIRLINE</h1>

        <div className="flex gap-8 text-gray-700 font-medium">
          <Link to="/">Flights</Link>
          <Link to="/bookings">Bookings</Link>
          <Link to="/checkin">Check-in</Link>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </button>
      </div>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/checkin" element={<Checkin />} />
      </Routes>

    </div>
  );
}