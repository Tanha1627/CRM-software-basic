from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    name = models.CharField(max_length=255)
    deal = models.CharField(max_length=255)
    amount_currency = models.CharField(max_length=255)
    contact_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=255)
    email = models.EmailField()
    company_name = models.CharField(max_length=255)
    status = models.CharField(max_length=255)  # Such as New, In Progress, etc.

    def __str__(self):
        return self.name

class Analytics(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    total_deals = models.IntegerField(default=0)
    won_deals = models.IntegerField(default=0)
    lost_deals = models.IntegerField(default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    won_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Analytics for {self.task.name}"
    

class DealTask(models.Model):
    STATUS_CHOICES = [
        ('New', 'New'),
        ('In Progress', 'In Progress'),
        ('Final Invoice', 'Final Invoice'),
        ('Deal Won', 'Deal Won'),
        ('Deal Lost', 'Deal Lost'),
    ]

    name = models.CharField(max_length=255)
    deal = models.CharField(max_length=255)
    amount_currency = models.CharField(max_length=255)  # Amount with currency sign as a string
    contact_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=255)
    email = models.EmailField()
    company_name = models.CharField(max_length=255)
    status = models.CharField(max_length=255, choices=STATUS_CHOICES)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    




class DealTask1(models.Model):
    STATUS_CHOICES = [
        ('New', 'New'),
        ('In Progress', 'In Progress'),
        ('Final Invoice', 'Final Invoice'),
        ('Deal Won', 'Deal Won'),
        ('Deal Lost', 'Deal Lost'),
    ]

    name = models.CharField(max_length=255)
    deal = models.CharField(max_length=255)
    amount_currency = models.CharField(max_length=255)  # Amount with currency sign as a string
    contact_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=255)
    email = models.EmailField()
    company_name = models.CharField(max_length=255)
    status = models.CharField(max_length=255, choices=STATUS_CHOICES)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)  # Ensure this field is included
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def amount_as_decimal(self):
        return float(self.amount_currency.replace('$', '').replace(',', ''))

# models.py


