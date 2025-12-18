from django.db import models

# Create your models here.

class Carro(models.Model):
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    modelo = models.CharField(max_length=100)
    
    class Meta:
        db_table = 'carro'
