# Generated by Django 5.1.6 on 2025-06-01 13:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('defense_acts', '0002_alter_defenseact_student'),
        ('users', '0004_alter_professor_id_alter_student_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='defenseact',
            name='author',
            field=models.ForeignKey(default=1, editable=False, on_delete=django.db.models.deletion.CASCADE, related_name='defense_acts', to='users.professor'),
            preserve_default=False,
        ),
    ]
