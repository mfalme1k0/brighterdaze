from django.urls import path

from .views import admin_bookings, index, submit_booking

urlpatterns = [
    path('', index, name='home'),
    path('bookings/', submit_booking, name='submit_booking'),
    path('admin-bookings/', admin_bookings, name='admin_bookings'),
]
