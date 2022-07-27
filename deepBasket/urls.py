from django.contrib import admin
from django.urls import path, include
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('authentication/', include('authorized.urls')),
    path('main/', include('central.urls')),
    path('func_control_panel/', include('administration.urls')),
    path('sellers/', include('seller.urls'))
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
