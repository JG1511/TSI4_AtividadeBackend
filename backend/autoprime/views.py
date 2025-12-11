from django.shortcuts import render
from .models import Carro
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.


@csrf_exempt
def getCarro(request):
    if request.method == "POST":
        # Tenta ler JSON do corpo da requisição
        try:
            data = json.loads(request.body)
            modelo = data.get("modelo")
        except json.JSONDecodeError:
            # Fallback para form-urlencoded
            modelo = request.POST.get("modelo")
        
        carro_buscado = Carro.objects.get(modelo=modelo)
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

@csrf_exempt
def saveCarro(request):
    if request.method == "POST":
        # Tenta ler JSON do corpo da requisição
        try:
            data = json.loads(request.body)
            modelo = data.get("modelo")
            preco = data.get("preco")
        except json.JSONDecodeError:
            # Fallback para form-urlencoded
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

@csrf_exempt
def updateCarro(request, carro_id):
    try:
        carro = Carro.objects.get(id=carro_id)
    except Carro.DoesNotExist:
        return JsonResponse(
            {"error": "Carro não encontrado."},
            status=404
        )
    
    if request.method == "POST":
        # Tenta ler JSON do corpo da requisição
        try:
            data = json.loads(request.body)
            modelo = data.get("modelo")
            preco = data.get("preco")
        except json.JSONDecodeError:
            # Fallback para form-urlencoded
            modelo = request.POST.get("modelo")
            preco = request.POST.get("preco")
        
        carro.modelo = modelo
        carro.preco = preco
        carro.save()
        return JsonResponse(
            {"message": "Carro atualizado com sucesso!"},
            status=200
        )

@csrf_exempt
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