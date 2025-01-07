from django.urls import path
from .views import render_page, fetch_courses

urlpatterns = [
    path('render-page/', render_page, name='render_page'),
    path('fetch-courses/', fetch_courses, name='render_courses'),
]
