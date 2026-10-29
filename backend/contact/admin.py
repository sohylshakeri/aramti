from django.contrib import admin
from .models import ContactRequest

# Register your models here.

class ContactRequestAdmin(admin.ModelAdmin):
    list_display =['contact' , 'status' , 'user' , 'show_services']
    search_fields =['user__username','message','contact']
    list_filter =['status' , 'services']

    def show_services(self, obj):
        names =obj.services.all()
        a=[]
        for name in names :
            a.append(name.name)
        return(','.join(a))    




admin.site.register(ContactRequest,ContactRequestAdmin)
