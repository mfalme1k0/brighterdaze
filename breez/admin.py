from django.contrib import admin

from .models import BookingRequest


@admin.register(BookingRequest)
class BookingRequestAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'service', 'date', 'created_at')
    search_fields = ('name', 'email', 'service')
    list_filter = ('service', 'date', 'created_at')
    ordering = ('-created_at',)
