from django.contrib import admin
from .models import Project, Task

class TaskInline(admin.TabularInline):
    model = Task
    extra = 0

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'owner', 'task_count', 'created_at')
    list_filter = ('status',)
    search_fields = ('title', 'owner__email')
    inlines = [TaskInline]

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'project', 'due_date', 'created_at')
    list_filter = ('status',)
    search_fields = ('title', 'project__title')