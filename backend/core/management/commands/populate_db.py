from django.core.management.base import BaseCommand
from django.apps import apps
from django_seed import Seed


class Command(BaseCommand):
    help = "Pobla la database con datos aleatorios para todos los modelos."

    def handle(self, *args, **kwargs):
        seeder = Seed.seeder()

        # Obtener todos los modelos registrados en la aplicación
        all_models = apps.get_models()

        # Recorre todos los modelos de la aplicacion segun su index
        for model in all_models.sort(key=lambda x, y: x.DB_INDEX < y.DB_INDEX):
            try:
                # Ajusta la cantidad de entradas según necesites
                seeder.add_entity(model, 50)
                self.stdout.write(self.style.SUCCESS(f"Preparando datos para {model.__name__}."))
            except Exception as e:
                self.stdout.write(
                    self.style.WARNING(f"No se pudieron generar datos para {model.__name__}: {e}")
                )

        # Ejecutar la creación de datos
        try:
            seeder.execute()
            self.stdout.write(self.style.SUCCESS("Base de datos poblada exitosamente."))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error al poblar la base de datos: {e}"))
