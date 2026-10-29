from django.db import models
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


# Create your models here.


class HomeStat(models.Model):
    key = models.SlugField(
        max_length=50,
        unique=True,
    )

    value = models.PositiveIntegerField()

    plus = models.BooleanField(
        default=False,
    )

    order = models.PositiveSmallIntegerField(
        default=0,
    )

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Home page statistic'
        verbose_name_plural = 'Home page statistics'

    def __str__(self):
        return f'{self.key}: {self.value}'




class Client(models.Model):
    display_name = models.CharField(
        max_length=150,
    )
    contact_email = models.EmailField(
    blank=True,
    default='',
    db_index=True,
)
    
    company = models.CharField(
        max_length=150,
        blank=True,
    )

    country = models.CharField(
        max_length=100,
    )

    city = models.CharField(
        max_length=100,
        blank=True,
    )

    collaboration_summary = models.CharField(
        max_length=255,
        blank=True,
    )

    map_x = models.DecimalField(
    max_digits=5,
    decimal_places=2,
    validators=[
        MinValueValidator(0),
        MaxValueValidator(100),
    ],
    blank=True,
    null=True,
)

    map_y = models.DecimalField(
    max_digits=5,
    decimal_places=2,
    validators=[
        MinValueValidator(0),
        MaxValueValidator(100),
    ],
    blank=True,
    null=True,
)
    avatar = models.ImageField(
        upload_to='clients/',
        blank=True,
        null=True,
    )

    # انتشار اطلاعات مشتری روی نقشه
    publication_consent = models.BooleanField(
        default=False,
    )

    is_approved = models.BooleanField(
        default=False,
    )

    show_on_map = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ['display_name']
        verbose_name = 'Client'
        verbose_name_plural = 'Clients'

    def __str__(self):
        return self.display_name


class Testimonial(models.Model):
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='testimonials',
    )

    text = models.TextField()

    # تأیید مدیر برای انتشار نظر
    is_approved = models.BooleanField(
        default=False,
    )

    # اجازه انتشار عمومی نظر از طرف مشتری
    publication_consent = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Customer testimonial'
        verbose_name_plural = 'Customer testimonials'

    def __str__(self):
        return f'Testimonial from {self.client.display_name}'