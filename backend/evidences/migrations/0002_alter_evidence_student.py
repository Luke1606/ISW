# Generated by Django 5.1.6 on 2025-05-12 02:47

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('evidences', '0001_initial'),
        ('users', '0002_remove_professor_user_remove_student_user_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='evidence',
            name='student',
            field=models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, related_name='evidences', to='users.student'),
        ),
    ]
