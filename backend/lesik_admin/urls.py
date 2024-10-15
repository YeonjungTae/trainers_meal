from django.urls import path
from . import views

app_name = 'lesik_admin'

urlpatterns = [
    path('', views.index, name='admin_view'),
    path('download/', views.excel, name='excel_download'),
]