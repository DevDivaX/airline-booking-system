from django.urls import path
from . import views
from .views import create_booking

urlpatterns = [
    path('search_flights/', views.search_flights),
    path('seatmap/<int:flight_id>/', views.seat_map),

    path('user/login/', views.login_user),
    path('book_seat/', views.book_seat),

    path("book/", create_booking),
]