from django.urls import path
from . import views
urlpatterns = [
   path("getCarros/", views.getCarros, name="getCarros"),
   path("saveCarro/", views.saveCarro, name="saveCarro"),
   path("updateCarro/<int:carro_id>/", views.updateCarro, name="updateCarro"),
    path("deleteCarro/<int:carro_id>/", views.deleteCarro, name="deleteCarro"),
]