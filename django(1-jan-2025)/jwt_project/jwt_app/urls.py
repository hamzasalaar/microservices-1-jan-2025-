from django.urls import path
from .views import render_user_page

urlpatterns = [
    path('render-page/', render_user_page, name='render_user_page'),
]
