from django.urls import path
from . import views

app_name = 'order'

urlpatterns = [
    path('meal/', views.get_meal_list.as_view(), name='meal_list'),
    path('register/', views.order_register.as_view(), name='order_register'),
    path('option/', views.order_option.as_view(), name='order_option'),
    path('confirm/', views.confirm_payment.as_view(), name='confirm_payment'),
]