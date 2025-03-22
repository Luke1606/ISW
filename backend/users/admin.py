from django.contrib import admin
from .models import Professor, Student


class UserAdmin(admin.ModelAdmin):
    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'Username'


@admin.register(Professor)
class ProfessorAdmin(UserAdmin):
    list_display = ['get_username', 'role']


@admin.register(Student)
class StudentAdmin(UserAdmin):
    list_display = ['get_username', 'faculty', 'group']
