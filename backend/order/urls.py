from django.urls import path
from . import views

app_name = 'order'

urlpatterns = [
    path('meal/', views.get_meal_list.as_view(), name='meal_list'),
    path('list/', views.get_order_list.as_view(), name='order_list'),
    path('option/', views.get_order_option.as_view(), name='order_option'),
    path('change/', views.edit_order_list.as_view(), name='edit_order'),
    path('submit/', views.submit_order.as_view(), name='submit_order'),
    path('payment/', views.submit_payment.as_view(), name='payment'),
]