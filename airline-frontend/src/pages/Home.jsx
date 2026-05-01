import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [flights, setFlights] = useState([]);

  const [showTicket, setShowTicket] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);

  // 🔍 SEARCH FLIGHTS
  const searchFlights = async () => {
    if (!from || !to || !date) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/search_flights/?from=${from}&to=${to}&date=${date}`
      );
      const data = await res.json();
      setFlights(data);
    } catch (err) {
      console.error(err);
      alert("Backend error");
    }
  };

  // 🪑 LOAD SEATS
  const loadSeats = async (flight) => {
    setSelectedFlight(flight);
    setSelectedSeat(null);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/seatmap/${flight.id}/`
      );
      const data = await res.json();

      const normalized = (data.seats || data).map((s) => ({
        ...s,
        is_booked:
          s.is_booked === true ||
          s.is_booked === "true" ||
          s.is_booked === 1,
      }));

      setSeats(normalized);
    } catch (err) {
      console.error(err);
      alert("Seat load failed");
    }
  };

  // 🔥 NORMALIZE SEAT FORMAT
  const normalizeSeat = (seatNumber) => {
    if (!seatNumber) return "";

    const sn = seatNumber.toUpperCase();
    const match =
      sn.match(/^([A-F])(\d+)$/) || sn.match(/^(\d+)([A-F])$/);

    if (!match) return sn;

    return isNaN(match[1])
      ? `${match[1]}${match[2]}`
      : `${match[2]}${match[1]}`;
  };

  // 🔥 GET ROWS
  const getRows = () => {
    const rows = new Set();

    seats.forEach((s) => {
      const sn = normalizeSeat(s.seat_number);
      const match = sn.match(/([A-F])(\d+)/);

      if (match) rows.add(parseInt(match[2]));
    });

    return Array.from(rows).sort((a, b) => a - b);
  };

  // 🔥 GET SEAT
  const getSeat = (row, letter) => {
    return seats.find(
      (s) => normalizeSeat(s?.seat_number) === `${letter}${row}`
    );
  };

  // 🎟 BOOK SEAT (BACKEND ONLY)
  const bookSeat = async () => {
    if (!selectedSeat) {
      alert("Select a seat first");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/book/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flight_id: selectedFlight.id,
          seat_id: selectedSeat.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      setBookingData(data);
      setShowTicket(true);
    } catch (err) {
      console.error(err);
      alert("Booking failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      {/* SEARCH */}
      <div className="bg-white p-6 rounded-xl shadow max-w-5xl mx-auto">
        <div className="grid md:grid-cols-4 gap-4">

          <input
            placeholder="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border p-3 rounded"
          />

          <input
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border p-3 rounded"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-3 rounded"
          />

          <button
            onClick={searchFlights}
            className="bg-blue-600 text-white rounded"
          >
            Search
          </button>

        </div>
      </div>

      {/* FLIGHTS */}
      <div className="max-w-5xl mx-auto mt-8 space-y-4">
        {flights.map((f) => (
          <div
            key={f.id}
            className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <div className="font-bold text-lg">{f.flight_name}</div>
              <div>{f.from} → {f.to}</div>
              <div className="text-sm text-gray-500">
                {f.departure_time} → {f.arrival_time}
              </div>
            </div>

            <div>
              ₹ {f.price}
              <button
                onClick={() => loadSeats(f)}
                className="ml-4 bg-blue-600 text-white px-3 py-1 rounded"
              >
                Book
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SEAT MODAL */}
      {selectedFlight && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl w-[600px] max-h-[90vh] overflow-hidden">

            <h2 className="text-lg font-bold mb-4">
              {selectedFlight.from} → {selectedFlight.to}
            </h2>

            <div className="max-h-[400px] overflow-y-auto">

              <div className="grid grid-cols-[40px_repeat(3,1fr)_40px_repeat(3,1fr)] text-center font-semibold mb-2">
                <div></div>
                <div>A</div><div>B</div><div>C</div>
                <div></div>
                <div>D</div><div>E</div><div>F</div>
              </div>

              {getRows().map((row) => (
                <div
                  key={row}
                  className="grid grid-cols-[40px_repeat(3,1fr)_40px_repeat(3,1fr)] gap-2 mb-2 items-center"
                >
                  <div className="text-center font-semibold">{row}</div>

                  {["A","B","C"].map((l) => {
                    const s = getSeat(row, l);
                    return (
                      <button
                        key={l}
                        disabled={s?.is_booked}
                        onClick={() => !s?.is_booked && setSelectedSeat(s)}
                        className={`p-2 rounded ${
                          normalizeSeat(selectedSeat?.seat_number) === normalizeSeat(s?.seat_number)
                            ? "bg-blue-600 text-white"
                            : s?.is_booked
                            ? "bg-gray-300"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {s ? normalizeSeat(s.seat_number) : ""}
                      </button>
                    );
                  })}

                  <div></div>

                  {["D","E","F"].map((l) => {
                    const s = getSeat(row, l);
                    return (
                      <button
                        key={l}
                        disabled={s?.is_booked}
                        onClick={() => !s?.is_booked && setSelectedSeat(s)}
                        className={`p-2 rounded ${
                          normalizeSeat(selectedSeat?.seat_number) === normalizeSeat(s?.seat_number)
                            ? "bg-blue-600 text-white"
                            : s?.is_booked
                            ? "bg-gray-300"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {s ? normalizeSeat(s.seat_number) : ""}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <button
              onClick={bookSeat}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded"
            >
              Confirm Booking
            </button>

          </div>
        </div>
      )}

      {/* POPUP */}
      {showTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[400px] text-center">
            <h2 className="text-xl font-bold text-green-600 mb-4">
              ✅ Booking Confirmed
            </h2>

            <p><b>PNR:</b> {bookingData?.pnr}</p>
            <p>{bookingData?.from} → {bookingData?.to}</p>
            <p><b>Seat:</b> {bookingData?.seat}</p>
            <p><b>Price:</b> ₹ {bookingData?.price}</p>

            <button
              onClick={() => {
                setShowTicket(false);
                setSelectedFlight(null);
                setSelectedSeat(null);
              }}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

    </div>
  );
}