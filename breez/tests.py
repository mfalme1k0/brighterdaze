from django.test import TestCase
from django.urls import reverse

from .models import BookingRequest


class BookingRequestTests(TestCase):
    def test_booking_submission_creates_request(self):
        response = self.client.post(
            reverse('submit_booking'),
            {
                'name': 'Ada',
                'email': 'ada@example.com',
                'service': 'Drafting',
                'date': '2026-08-01',
                'message': 'Need a consultation',
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(BookingRequest.objects.count(), 1)
        booking = BookingRequest.objects.get()
        self.assertEqual(booking.name, 'Ada')
        self.assertEqual(booking.service, 'Drafting')

    def test_booking_submission_requires_required_fields(self):
        response = self.client.post(
            reverse('submit_booking'),
            {
                'name': '',
                'email': 'ada@example.com',
                'service': 'Drafting',
                'date': '2026-08-01',
                'message': 'Need a consultation',
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(BookingRequest.objects.count(), 0)
