from django.db import models
from django.contrib.auth.models import User
from services.models import Service

# Create your models here.
class ContactRequest(models.Model):
    

    class Status(models.TextChoices):
        NEW = 'new' , 'New'
        CONTACTED = 'contacted' , 'Contacted'
        IN_PROGRESS = 'in_progress', 'In Progress' 
        CLOSED = 'closed','Closed'
    status = models.CharField(max_length=50 ,choices= Status ,default= Status.NEW) 
    user = models.ForeignKey(
    User,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="contact_requests"
)  
    name = models.CharField(max_length=100)
    contact = models.CharField(max_length=50)
    message = models.TextField()
    services = models.ManyToManyField(Service,related_name="contact_requests") 


