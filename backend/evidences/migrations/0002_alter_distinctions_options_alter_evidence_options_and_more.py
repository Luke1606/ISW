# Generated by Django 5.1.6 on 2025-03-24 05:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('evidences', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='distinctions',
            options={'ordering': ['id']},
        ),
        migrations.AlterModelOptions(
            name='evidence',
            options={'ordering': ['id']},
        ),
        migrations.AlterModelOptions(
            name='project',
            options={'ordering': ['id']},
        ),
        migrations.AlterModelOptions(
            name='scientificarticle',
            options={'ordering': ['id']},
        ),
    ]
