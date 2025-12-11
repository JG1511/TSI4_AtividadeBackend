from django.urls import path
from . import views
urlpatterns = [
   path("getCarro/", views.getCarro, name="getCarro"),
   path("listarCarros/", views.listarCarros, name="listarCarros"),
   path("saveCarro/", views.saveCarro, name="saveCarro"),
   path("updateCarro/<int:carro_id>/", views.updateCarro, name="updateCarro"),
   path("deleteCarro/<int:carro_id>/", views.deleteCarro, name="deleteCarro"),
]