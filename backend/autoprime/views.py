from django.shortcuts import render
from .models import Carro
from django.http import JsonResponse

# Create your views here.


def getCarros(request):
    if request.method == "POST":
        modelo = request.POST.get("modelo")
        
        carro_buscado = Carro.object.get(modelo=modelo)
        preco = carro_buscado.preco

        return JsonResponse(
            {"preco": preco},
            status=200
        )



def listarCarros(request):
    carros = list(Carro.objects.values())
    return JsonResponse(
        {"carros": carros},
        status=200
    )

def saveCarro(request):
    
    if request.method == "POST":
        modelo = request.POST.get("modelo")
        preco = request.POST.get("preco")
        carro = Carro(modelo=modelo, preco=preco)
        carro.save()
        return JsonResponse(
            {"message": "Carro salvo com sucesso!"},
            status=201
        )
    return JsonResponse(
        {"error": "Método não permitido."},
        status=405
    )

def updateCarro(request, carro_id):
    
    try:
        carro = Carro.objects.get(id=carro_id)
    except Carro.DoesNotExist:
        return JsonResponse(
            {"error": "Carro não encontrado."},
            status=404
        )
    
    if request.method == "POST":
        modelo = request.POST.get("modelo")
        preco = request.POST.get("preco")
        carro.modelo = modelo
        carro.preco = preco
        carro.save()
        return JsonResponse(
            {"message": "Carro atualizado com sucesso!"},
            status=200
        )

def deleteCarro(request, carro_id):
    
    try:
        carro = Carro.objects.get(id=carro_id)
    except Carro.DoesNotExist:
        return JsonResponse(
            {"error": "Carro não encontrado."},
            status=404
        )
    
    if request.method == "DELETE":
        carro.delete()
        return JsonResponse(
            {"message": "Carro deletado com sucesso!"},
            status=200
        )