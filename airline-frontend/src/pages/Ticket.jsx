import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Ticket() {
  const location = useLocation();
  const navigate = useNavigate();

  const { from, to, price } = location.state || {};

  const [selectedSeat, setSelectedSeat] = useState(null);

  const seats = Array.from({ length: 30 }, (_, i) => `A${i + 1}`);

  const confirmBooking = () => {
    if (!selectedSeat) {
      alert("Select a seat");
      return;
    }

    const booking = {
      pnr: "PNR" + Math.floor(Math.random() * 1000000),
      from,
      to,
      seat: selectedSeat,
      price,
    };

    // save to localStorage
    const old = JSON.parse(localStorage.getItem("bookings")) || [];
    localStorage.setItem("bookings", JSON.stringify([...old, booking]));

    navigate("/bookings");
  };

  if (!from) {
    return <div className="text-center mt-20">No flight selected</div>;
  }

  return (
    <div className="text-center mt-10">

      <h2 className="text-2xl font-bold mb-4">
        {from} → {to}
      </h2>

      <div className="grid grid-cols-5 gap-3 justify-center w-[300px] mx-auto">
        {seats.map((s) => (
          <button
            key={s}
            onClick={() => setSelectedSeat(s)}
            className={`p-2 rounded ${
              selectedSeat === s
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <button
        onClick={confirmBooking}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
      >
        Confirm Booking
      </button>

    </div>
  );
}