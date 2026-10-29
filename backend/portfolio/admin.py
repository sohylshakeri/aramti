from django.contrib import admin
from .models import Category, Project , ProjectImage

# Register your models here.
class CategoryAdmin (admin.ModelAdmin):
       list_display = ['name']
       search_fields = ['name']

admin.site.register(Category , CategoryAdmin)
class  ProjectImageInline(admin.TabularInline):
       model = ProjectImage
       extra = 1
       can_delete = True
       

class ProjectAdmin(admin.ModelAdmin):
       list_display = ['title' , 'link']
       search_fields = ['title' , 'description']
       ordering = ['title']
       filter_horizontal = ['categories']
       list_filter = ['categories']
       inlines=[ProjectImageInline]

admin.site.register(Project ,ProjectAdmin)