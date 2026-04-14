from django.urls import path, include
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, TaskViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')

urlpatterns = router.urls + [
    path('projects/<int:project_pk>/tasks/', TaskViewSet.as_view({'get': 'list', 'post': 'create'}), name='project-tasks'),
    path('projects/<int:project_pk>/tasks/<int:pk>/', TaskViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='project-task-detail'),
]