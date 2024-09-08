# views.py

from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login as auth_login
from django.contrib.auth.decorators import login_required
from .forms import CustomUserCreationForm, CustomAuthenticationForm
from .models import Task
import json




def landing_page(request):
    """Render the landing page for the CRM website."""
    return render(request, 'myapp/landing.html')

def signup(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()  # Saves the user to the database
            auth_login(request, user)
            return redirect('home')  # Redirect to home page after successful signup
    else:
        form = CustomUserCreationForm()
    return render(request, 'myapp/signup.html', {'form': form})

def login(request):
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()  # Retrieves the user from the database
            auth_login(request, user)
            return redirect('home')  # Redirect to home page after successful login
    else:
        form = CustomAuthenticationForm()
    return render(request, 'myapp/login.html', {'form': form})

@login_required
def home(request):
    """Render the home page."""
    return render(request, 'myapp/home.html')

@login_required
def kanban_page(request):
    """Render the Kanban board page."""
    tasks = Task.objects.all()
    return render(request, 'myapp/kanban.html', {'tasks': tasks})

@csrf_exempt
def add_task(request):
    """Add a new task to the Kanban board."""
    if request.method == 'POST':
        data = json.loads(request.body)
        task = Task(
            name=data['name'],
            deal=data['deal'],
            amount_currency=data['amountCurrency'],
            contact_name=data['contactName'],
            phone=data['phone'],
            email=data['email'],
            company_name=data['companyName'],
            status=data['status']
        )
        task.save()
        return JsonResponse({'status': 'success', 'task_id': task.id})
    return JsonResponse({'status': 'error'}, status=400)

@csrf_exempt
def delete_task(request, task_id):
    """Delete a task from the database."""
    task = get_object_or_404(Task, id=task_id)
    task.delete()
    return JsonResponse({'status': 'success'})

@csrf_exempt
def update_task_status(request, task_id):
    """Update the status of a task."""
    task = get_object_or_404(Task, id=task_id)
    data = json.loads(request.body)
    task.status = data['status']
    task.save()
    return JsonResponse({'status': 'success'})


