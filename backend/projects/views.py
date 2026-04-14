from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Project, Task
from .serializers import ProjectSerializer, ProjectDetailSerializer, TaskSerializer, TaskCreateSerializer
from .filters import ProjectFilter, TaskFilter


class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filterset_class = ProjectFilter
    search_fields = ('title', 'description')
    ordering_fields = ('created_at', 'updated_at', 'title', 'status')
    ordering = ('-created_at',)

    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user).prefetch_related('tasks')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

@action(detail=True, methods=['get', 'post'])
def tasks(self, request, pk=None):
    project = self.get_object()

    if request.method == 'GET':
        tasks = project.tasks.all()
        status_filter = request.query_params.get('status')
        if status_filter:
            tasks = tasks.filter(status=status_filter)

        serializer = TaskCreateSerializer(tasks, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TaskCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(project=project)
        return Response(serializer.data, status=201)

class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filterset_class = TaskFilter
    search_fields = ('title', 'description')
    ordering_fields = ('due_date', 'created_at', 'status')
    ordering = ('due_date', '-created_at')

    def get_queryset(self):
        return Task.objects.filter(
            project__owner=self.request.user,
            project_id=self.kwargs.get('project_pk')
        )

    def get_serializer_class(self):
        return TaskCreateSerializer

    def perform_create(self, serializer):
        project_pk = self.kwargs.get('project_pk')
        try:
            project = Project.objects.get(pk=project_pk, owner=self.request.user)
        except Project.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound('Project not found.')
        serializer.save(project=project)