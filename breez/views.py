import json

from django.contrib.admin.views.decorators import staff_member_required
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST

from .models import BookingRequest


def index(request):
    return render(request, 'index.html')


@staff_member_required
def admin_bookings(request):
    bookings = BookingRequest.objects.order_by('-created_at')
    return render(request, 'admin_bookings.html', {'bookings': bookings})


@require_POST
def submit_booking(request):
    data = request.POST
    required_fields = ['name', 'email', 'service', 'date']

    for field in required_fields:
        if not data.get(field, '').strip():
            return JsonResponse({'message': f'{field} is required.'}, status=400)

    booking = BookingRequest.objects.create(
        name=data.get('name', '').strip(),
        email=data.get('email', '').strip(),
        service=data.get('service', '').strip(),
        date=data.get('date', '').strip(),
        message=data.get('message', '').strip(),
    )

    return JsonResponse({
        'message': 'Booking request received.',
        'booking_id': booking.id,
        'contact_email': 'brytoh38@gmail.com',
        'contact_phone': '0703183524',
    })
