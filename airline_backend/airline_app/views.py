from rest_framework.response import Response
from django.http import JsonResponse
from .models import Flight
from rest_framework.decorators import api_view
from datetime import datetime
from .models import Route, Flight, Seat, User, Booking
from .serializers import (
    RouteSerializer, FlightSerializer, SeatSerializer,
    UserSerializer, BookingSerializer
)


# ------------------ Search Flights ---------------------
@api_view(['GET'])


def search_flights(request):
    from_city = request.GET.get('from')
    to_city = request.GET.get('to')
    date = request.GET.get('date')

    flights = Flight.objects.filter(
        route__source_airport__iexact=from_city,
        route__destination_airport__iexact=to_city,
        departure_datetime__date=date
    )

    data = []
    for f in flights:
        data.append({
            "id": f.id,
            "from": f.route.source_airport,
            "to": f.route.destination_airport,
            "departure": str(f.departure_datetime),
            "price": float(f.base_price)
        })

    return JsonResponse(data, safe=False)


# ------------------ Seat Map ---------------------------
@api_view(['GET'])
def seat_map(request, flight_id):
    seats = Seat.objects.filter(flight_id=flight_id)
    serializer = SeatSerializer(seats, many=True)
    return Response(serializer.data)


# ------------------ User Register ----------------------
# views.py


import random

@api_view(['POST'])
def create_booking(request):
    flight_id = request.data.get("flight_id")
    seat_id = request.data.get("seat_id")

    flight = Flights.objects.get(id=flight_id)
    seat = Seats.objects.get(id=seat_id)

    if seat.is_booked:
        return Response({"error": "Seat already booked"}, status=400)

    # mark seat booked
    seat.is_booked = True
    seat.save()

    booking = Booking.objects.create(
        flight=flight,
        seat=seat,
        price=flight.price,
        pnr="PNR" + str(random.randint(100000, 999999))
    )

    return Response({
        "pnr": booking.pnr,
        "flight": f"{flight.from_city} → {flight.to_city}",
        "seat": seat.seat_number,
        "price": booking.price,
        "flight_name": flight.flight_name,
        "departure": flight.departure_time,
        "arrival": flight.arrival_time
    })


# ------------------ User Login -------------------------
@api_view(['POST'])
def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        user = User.objects.get(email=email, password=password)
        return Response({"message": "Login successful", "user_id": user.id})
    except User.DoesNotExist:
        return Response({"error": "Invalid credentials"}, status=400)


# ------------------ Book Seat --------------------------
@api_view(['POST'])
def book_seat(request):
    user_id = request.data.get("user_id")
    flight_id = request.data.get("flight_id")
    seat_id = request.data.get("seat_id")

    seat = Seat.objects.get(id=seat_id)
    if seat.is_booked:
        return Response({"error": "Seat already booked"}, status=400)

    seat.is_booked = True
    seat.save()

    booking = Booking.objects.create(
        user_id=user_id,
        flight_id=flight_id,
        seat_id=seat_id,
        price_paid=1000  # dynamic price will be added later
    )

    return Response({"message": "Seat booked", "booking_id": booking.id})

