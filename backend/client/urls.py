from django.urls import path
from . import views

app_name = 'client'

urlpatterns = [
    path('list/', views.get_client_list.as_view(), name='client_list'),
    path('edit/', views.edit_client.as_view(), name='edit_client'),
    # path('detail/', views.get_client_info.as_view(), name='client_info'),
    path('option/', views.get_option_list.as_view(), name='options'),
    path('delivery/', views.get_delivery_options.as_view(), name='delivery'),
    path('bia/', views.add_bia.as_view(), name='bia'),
    path('address/', views.get_address_info.as_view(), name='address'),
]