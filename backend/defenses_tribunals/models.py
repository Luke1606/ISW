import datetime
from django.db import models
from django.db.models import Q
from users.models import Student, Professor
from backend.base.base_model import BaseModel


class DefenseTribunal(BaseModel):
    """
    Modelo para representar un tribunal de defensa.
    """
    student = models.OneToOneField(
        to=Student,
        editable=False,
        unique=True,
        blank=False,
        null=False,
        related_name='defense_tribunal',
        on_delete=models.CASCADE
    )
    defense_date = models.DateField(blank=True, null=True)

    president = models.ForeignKey(
        to=Professor,
        blank=True,
        null=True,
        related_name='defense_tribunal_president',
        on_delete=models.SET_NULL
    )
    secretary = models.ForeignKey(
        to=Professor,
        blank=True,
        null=True,
        related_name='defense_tribunal_secretary',
        on_delete=models.SET_NULL
    )
    vocal = models.ForeignKey(
        to=Professor,
        blank=True,
        null=True,
        related_name='defense_tribunal_vocal',
        on_delete=models.SET_NULL
    )
    oponent = models.ForeignKey(
        to=Professor,
        blank=True,
        null=True,
        related_name='defense_tribunal_oponent',
        on_delete=models.SET_NULL
    )
    tutor = models.ForeignKey(
        to=Professor,
        blank=True,
        null=True,
        related_name='defense_tribunal_tutor',
        on_delete=models.SET_NULL
    )

    class State(models.TextChoices):
        """Estados del tribunal de defensa."""
        APPROVED = 'Apr', 'Aprobado'
        DISAPPROVED = 'Dis', 'Desaprobado'
        PENDING = 'Pend', 'Pendiente'
        EMPTY = 'emp', 'Vacio'

    state = models.CharField(
        max_length=20,
        choices=State.choices,
        default=State.EMPTY
    )

    SEARCHABLE_FIELDS = {
        'student__username': 'icontains',
        'president__username': 'icontains',
        'secretary__username': 'icontains',
        'vocal__username': 'icontains',
        'oponent__username': 'icontains',
        'tutor__username': 'icontains',
        'defense_date': 'exact',
        'state': 'icontains',
    }

    def clean(self):
        """
        Método para validar la integridad del modelo y actualizar el estado automáticamente.
        """
        # Verificar si todos los campos necesarios están asignados (excepto `defense_date`)
        if all([self.president, self.secretary, self.vocal, self.oponent, self.tutor]):
            self.state = self.State.PENDING
        else:
            self.state = self.State.EMPTY
        super().clean()

    @classmethod
    def parse_date_filter(cls, date_str):
        """
        Convierte un string de fecha en un filtro válido para el queryset.
        Si el formato no es válido, lanza un ValueError.
        """
        try:
            date = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
            return {'defense_date': date}
        except ValueError as exc:
            raise ValueError(f"El formato de fecha '{date_str}' no es válido. Use 'YYYY-MM-DD'.") from exc

    @classmethod
    def build_search_conditions(cls, search_term):
        """
        Construye dinámicamente las condiciones de búsqueda sin necesidad de _meta.
        """
        conditions = Q()
        for field, lookup in cls.SEARCHABLE_FIELDS.items():
            if '__' in field:  # Si el campo es una relación
                # Dividimos el campo para identificar el modelo relacionado
                related_field, subfield = field.split('__', 1)
                related_instance = cls._get_related_instance(related_field)
                if related_instance:
                    related_searchable_fields = getattr(related_instance, "SEARCHABLE_FIELDS", {})
                    if subfield in related_searchable_fields:
                        conditions |= Q(**{f"{field}__{lookup}": search_term})
            else:
                conditions |= Q(**{f"{field}__{lookup}": search_term})
        return conditions

    @staticmethod
    def _get_related_instance(field_name):
        """
        Obtiene la clase relacionada sin necesidad de usar _meta.
        """
        related_mappings = {
            'student': Student,
            'president': Professor,
            'secretary': Professor,
            'vocal': Professor,
            'oponent': Professor,
            'tutor': Professor,
        }
        return related_mappings.get(field_name, None)

    @classmethod
    def search(cls, search_term=None, date_filter=None, **kwargs):
        """
        Implementación de búsqueda avanzada usando el manager `BaseModelManager`.

        Args:
            search_term (str): Término para buscar en SEARCHABLE_FIELDS.
            date_filter (str): String de fecha en formato `YYYY-MM-DD`.
            kwargs: Otros parámetros para la búsqueda.

        Returns:
            QuerySet: QuerySet filtrado basado en las condiciones de búsqueda.
        """
        queryset = cls.objects.all()

        # Aplicar condiciones de búsqueda por término
        if search_term:
            conditions = cls.build_search_conditions(search_term)
            queryset = queryset.filter(conditions)

        # Aplicar filtro de fecha si se proporciona
        if date_filter:
            date_conditions = cls.parse_date_filter(date_filter)
            queryset = queryset.filter(**date_conditions)

        return cls.objects.search(queryset=queryset, **kwargs)
