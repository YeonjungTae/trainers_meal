from django.urls import path
from . import views

app_name = 'client'

urlpatterns = [
    path('list/', views.get_client_list.as_view(), name='client_list'),
    path('add/', views.add_client.as_view(), name='add_client'),
    path('update/', views.update_client.as_view(), name='update_client'),
    path('delete/', views.delete_client.as_view(), name='delete_client'),
    path('option/', views.get_option_list.as_view(), name='options'),
    path('delivery/', views.get_delivery_options.as_view(), name='delivery'),
    path('detail/', views.get_client_info.as_view(), name='client_info'),
    path('bia/', views.add_bia.as_view(), name='bia'),
    path('address/', views.get_address_info.as_view(), name='address'),
]