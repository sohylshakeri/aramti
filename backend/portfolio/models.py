from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth.models import User

# Create your models here.
class Category (models.Model):
    name = models.CharField(max_length=100,unique=True)
    def __str__(self):
        return self.name


class Project(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    link = models.URLField(blank=True)
    categories = models.ManyToManyField(Category)
    author = models.ForeignKey(
    User,
    on_delete=models.CASCADE
)

class ProjectImage(models.Model):
    project = models.ForeignKey(Project,on_delete=models.CASCADE,related_name="images")
    image = models.ImageField(upload_to='projects/')
    order = models.IntegerField(validators=[MinValueValidator(1)])

    class Meta:
        ordering = ["order"]

        constraints=[
            models.UniqueConstraint(
                fields=['project' ,'order'],
                name= 'unique_project_image_order'
            )
        ]



