from rest_framework import serializers
from .models import Project, Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'status', 'due_date', 'project', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_status(self, value):
        valid = ['todo', 'in-progress', 'done']
        if value not in valid:
            raise serializers.ValidationError(f'Status must be one of: {", ".join(valid)}')
        return value

    def validate_project(self, value):
        request = self.context.get('request')
        if request and value.owner != request.user:
            raise serializers.ValidationError('You do not have permission to add tasks to this project.')
        return value


class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'status', 'due_date', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_status(self, value):
        valid = ['todo', 'in-progress', 'done']
        if value not in valid:
            raise serializers.ValidationError(f'Status must be one of: {", ".join(valid)}')
        return value


class ProjectSerializer(serializers.ModelSerializer):
    task_count = serializers.ReadOnlyField()
    completed_task_count = serializers.ReadOnlyField()
    owner_email = serializers.ReadOnlyField(source='owner.email')

    class Meta:
        model = Project
        fields = ('id', 'title', 'description', 'status', 'owner', 'owner_email',
                  'task_count', 'completed_task_count', 'created_at', 'updated_at')
        read_only_fields = ('id', 'owner', 'created_at', 'updated_at')

    def validate_status(self, value):
        valid = ['active', 'completed']
        if value not in valid:
            raise serializers.ValidationError(f'Status must be one of: {", ".join(valid)}')
        return value


class ProjectDetailSerializer(ProjectSerializer):
    tasks = TaskCreateSerializer(many=True, read_only=True)

    class Meta(ProjectSerializer.Meta):
        fields = ProjectSerializer.Meta.fields + ('tasks',)