from django.urls import path
from . import views

app_name = 'lesik_admin'

urlpatterns = [
    path('', views.excel.as_view(), name='excel_download'),
    # path('check_token/', views.check_token.as_view(), name='token'),
    # path('login/', views.login.as_view(), name='login'),
    # path('register/', views.register.as_view(), name='register'),
    # path('get_gym_list/', views.gym_list.as_view(), name='gym_list'),
    # path('forgot_password/', views.forgot_password.as_view(), name='pw'),
    # path('forgot_username/', views.forgot_username.as_view(), name='id'),
]