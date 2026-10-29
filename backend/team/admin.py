from django.contrib import admin
from .models import TeamMember


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "specialty", "image")
    search_fields = (
        "user__username",
        "user__first_name",
        "user__last_name",
        "specialty",
    )
    list_select_related = ("user",)