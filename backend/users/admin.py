from django.contrib import admin
from .models import Student, Professor


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('username', 'faculty', 'group')
    search_fields = ('username', 'faculty')


@admin.register(Professor)
class ProfessorAdmin(admin.ModelAdmin):
    list_display = ('username', 'role', 'is_superuser', 'is_staff')
    search_fields = ('username', 'role')
    list_filter = ('role',)
