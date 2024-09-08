# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.landing_page, name='landing_page'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('home/', views.home, name='home'),
    path('kanban/', views.kanban_page, name='kanban_page'),
    path('add_task/', views.add_task, name='add_task'),
    path('delete_task/<int:task_id>/', views.delete_task, name='delete_task'),
    path('update_task_status/<int:task_id>/', views.update_task_status, name='update_task_status'),
    path('deals/', views.kanban_page, name='deals'),
    
]

