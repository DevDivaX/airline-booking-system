from django.contrib import admin
from .models import Aircraft, Route, Flight, Seat, User, Booking

admin.site.register(Aircraft)
admin.site.register(Route)
admin.site.register(Flight)
admin.site.register(Seat)
admin.site.register(User)
admin.site.register(Booking)

