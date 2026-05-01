import { useEffect, useState } from "react";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(data);
  }, []);

  return (
    <div className="p-10">

      <h2 className="text-3xl font-bold text-center mb-6">
        📄 My Bookings
      </h2>

      {bookings.length === 0 ? (
        <p className="text-center">No bookings yet</p>
      ) : (
        <div className="space-y-4 max-w-xl mx-auto">

          {bookings.map((b, i) => (
            <div key={i} className="bg-white p-4 rounded shadow">
              <p><b>PNR:</b> {b.pnr}</p>
              <p>{b.from} → {b.to}</p>
              <p>Seat: {b.seat}</p>
              <p>₹ {b.price}</p>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}