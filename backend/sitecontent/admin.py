from django.contrib import admin

from .models import HomeStat, Client, Testimonial


@admin.register(HomeStat)
class HomeStatAdmin(admin.ModelAdmin):
    list_display = [
        'key',
        'value',
        'plus',
        'order',
    ]

    list_editable = [
        'value',
        'plus',
        'order',
    ]

    search_fields = ['key']
    ordering = ['order', 'id']


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = [
        'display_name',
        'company',
        'country',
        'city',
        'is_approved',
        'show_on_map',
        'publication_consent',
    ]

    list_filter = [
        'is_approved',
        'show_on_map',
        'publication_consent',
        'country',
    ]

    search_fields = [
        'display_name',
        'company',
        'contact_email',
        'country',
        'city',
    ]

    readonly_fields = ['created_at']

    fields = [
        'display_name',
        'contact_email',
        'company',
        'country',
        'city',
        'collaboration_summary',
        'avatar',
        'map_x',
        'map_y',
        'publication_consent',
        'is_approved',
        'show_on_map',
        'created_at',
    ]


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = [
        'client',
        'created_at',
        'is_approved',
        'publication_consent',
    ]

    list_filter = [
        'is_approved',
        'publication_consent',
        'created_at',
    ]

    search_fields = [
        'client__display_name',
        'client__company',
        'client__contact_email',
        'text',
    ]

    readonly_fields = ['created_at']

    fields = [
        'client',
        'text',
        'publication_consent',
        'is_approved',
        'created_at',
    ]