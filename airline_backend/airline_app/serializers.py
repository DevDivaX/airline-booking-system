from rest_framework import serializers
from datetime import datetime
from decimal import Decimal


from .models import Aircraft, Route, Flight, Seat, User, Booking


class AircraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aircraft
        fields = '__all__'


class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'


class FlightSerializer(serializers.ModelSerializer):
    dynamic_price = serializers.SerializerMethodField()
    route = RouteSerializer()
    aircraft = AircraftSerializer()

    class Meta:
        model = Flight
        fields = '__all__'

    def get_dynamic_price(self, obj):
        from decimal import Decimal
from datetime import datetime
from .models import Seat

class FlightSerializer(serializers.ModelSerializer):
    dynamic_price = serializers.SerializerMethodField()
    route = RouteSerializer()
    aircraft = AircraftSerializer()

    class Meta:
        model = Flight
        fields = '__all__'

    def get_dynamic_price(self, obj):

        total_seats = obj.aircraft.total_seats
        booked_seats = Seat.objects.filter(flight=obj, is_booked=True).count()

        seat_factor = Decimal(booked_seats) / Decimal(total_seats)

        days_left = (obj.departure_datetime.date() - datetime.now().date()).days

        if days_left <= 1:
            time_factor = Decimal("0.6")
        elif days_left <= 3:
            time_factor = Decimal("0.4")
        elif days_left <= 7:
            time_factor = Decimal("0.2")
        else:
            time_factor = Decimal("0.0")

        dynamic_price = (
            obj.base_price +
            (obj.base_price * seat_factor * Decimal("1.5")) +
            (obj.base_price * time_factor)
        )

        return round(dynamic_price, 2)




class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
