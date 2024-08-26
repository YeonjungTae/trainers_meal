from django.conf import settings
from django.views.static import serve
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static

def trigger_error(request):
    division_by_zero = 1 / 0

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('trainer.urls', namespace='trainer')),
    path('client/', include('client.urls', namespace='client')),
    path('order/', include('order.urls', namespace='order')),
    path('sentry-debug/', trigger_error),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)