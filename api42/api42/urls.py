
from django.contrib import admin
from django.urls import path
from .views import Enable42, Disable42, login42, Api42

urlpatterns = [
    path('admin/', admin.site.urls),
    path('enable42/', Enable42.as_view()),
    path('disable42/', Disable42.as_view()),
    path('login42/', login42.as_view()),
	path('api-auth/', Api42.as_view())
]
