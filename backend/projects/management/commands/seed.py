from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from projects.models import Project, Task
from datetime import date, timedelta
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed the database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        # Create demo users
        users_data = [
            {'email': 'alice@demo.com', 'first_name': 'Alice', 'last_name': 'Johnson', 'password': 'demo1234'},
            {'email': 'bob@demo.com', 'first_name': 'Bob', 'last_name': 'Smith', 'password': 'demo1234'},
        ]

        users = []
        for data in users_data:
            user, created = User.objects.get_or_create(
                email=data['email'],
                defaults={'first_name': data['first_name'], 'last_name': data['last_name']}
            )
            if created:
                user.set_password(data['password'])
                user.save()
                self.stdout.write(f'  Created user: {user.email}')
            else:
                self.stdout.write(f'  User exists: {user.email}')
            users.append(user)

        # Project templates
        projects_data = [
            {'title': 'Website Redesign', 'description': 'Complete overhaul of company website with modern design', 'status': 'active'},
            {'title': 'Mobile App v2', 'description': 'Second version of our mobile application with new features', 'status': 'active'},
            {'title': 'API Integration', 'description': 'Integrate third-party payment and analytics APIs', 'status': 'completed'},
            {'title': 'Q4 Marketing Campaign', 'description': 'Plan and execute end-of-year marketing campaigns', 'status': 'active'},
            {'title': 'Database Migration', 'description': 'Migrate from legacy database to PostgreSQL', 'status': 'completed'},
        ]

        tasks_templates = [
            [
                {'title': 'Design mockups', 'status': 'done', 'days': -5},
                {'title': 'Frontend development', 'status': 'in-progress', 'days': 3},
                {'title': 'SEO optimization', 'status': 'todo', 'days': 10},
                {'title': 'Content migration', 'status': 'todo', 'days': 14},
            ],
            [
                {'title': 'Architecture planning', 'status': 'done', 'days': -10},
                {'title': 'Auth module', 'status': 'done', 'days': -3},
                {'title': 'Push notifications', 'status': 'in-progress', 'days': 5},
                {'title': 'App Store submission', 'status': 'todo', 'days': 20},
            ],
            [
                {'title': 'API documentation review', 'status': 'done', 'days': -20},
                {'title': 'Payment gateway setup', 'status': 'done', 'days': -10},
                {'title': 'Analytics integration', 'status': 'done', 'days': -5},
            ],
            [
                {'title': 'Campaign strategy', 'status': 'done', 'days': -7},
                {'title': 'Ad creatives', 'status': 'in-progress', 'days': 2},
                {'title': 'Email campaign', 'status': 'todo', 'days': 7},
                {'title': 'Social media posts', 'status': 'todo', 'days': 9},
                {'title': 'Performance tracking', 'status': 'todo', 'days': 15},
            ],
            [
                {'title': 'Schema mapping', 'status': 'done', 'days': -30},
                {'title': 'Data migration scripts', 'status': 'done', 'days': -20},
                {'title': 'Testing & validation', 'status': 'done', 'days': -10},
            ],
        ]

        for i, (proj_data, task_list) in enumerate(zip(projects_data, tasks_templates)):
            user = users[i % len(users)]
            project, created = Project.objects.get_or_create(
                title=proj_data['title'],
                owner=user,
                defaults={'description': proj_data['description'], 'status': proj_data['status']}
            )
            if created:
                self.stdout.write(f'  Created project: {project.title}')
                for task_data in task_list:
                    Task.objects.create(
                        title=task_data['title'],
                        description=f'Task for {project.title}: {task_data["title"]}',
                        status=task_data['status'],
                        due_date=date.today() + timedelta(days=task_data['days']),
                        project=project
                    )
                self.stdout.write(f'    Added {len(task_list)} tasks')

        self.stdout.write(self.style.SUCCESS('\nSeeding complete!'))
        self.stdout.write('Demo accounts:')
        self.stdout.write('  alice@demo.com / demo1234')
        self.stdout.write('  bob@demo.com / demo1234')