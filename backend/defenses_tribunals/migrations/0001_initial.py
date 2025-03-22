# Generated by Django 5.1.6 on 2025-03-20 23:06

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='DefenseTribunal',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('defense_date', models.DateField(blank=True, null=True)),
                ('state', models.CharField(choices=[('Apr', 'Aprobado'), ('Dis', 'Desaprobado'), ('Pend', 'Pendiente'), ('Inc', 'Incompleto')], default='Inc', max_length=20)),
                ('oponent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='defense_tribunal_oponent', to='users.professor')),
                ('president', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='defense_tribunal_president', to='users.professor')),
                ('secretary', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='defense_tribunal_secretary', to='users.professor')),
                ('student', models.OneToOneField(editable=False, on_delete=django.db.models.deletion.CASCADE, related_name='defense_tribunal', to='users.student')),
                ('tutor', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='defense_tribunal_tutor', to='users.professor')),
                ('vocal', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='defense_tribunal_vocal', to='users.professor')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
