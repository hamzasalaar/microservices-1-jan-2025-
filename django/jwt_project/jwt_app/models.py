from django.db import models

class Course(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    enrollment_fee = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name
