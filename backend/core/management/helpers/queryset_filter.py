from django.db.models import Q
from datetime import datetime
from .dynamic_filterset_factory import DynamicFilterSetFactory


class QuerysetFilter:
    """
    Clase para construir dinámicamente condiciones de búsqueda con Q basadas en el campo SEARCHABLE_FIELDS.
    """
    def __init__(self, model):
        """
        Inicializa el constructor de condiciones dinámicas y crea una instancia del FilterSet dinámico.

        Args:
            model (Model): Modelo de Django con SEARCHABLE_FIELDS.
            search_term (str, opcional): Término general de búsqueda.
            queryset (QuerySet, opcional): QuerySet inicial a filtrar.
            join_type (str, opcional): Tipo de unión lógica ("AND" o "OR").
            **kwargs: Filtros específicos definidos en SEARCHABLE_FIELDS.
        """
        self.model = model
        # Crear instancia del FilterSet dinámico
        self.dynamic_filter_factory = DynamicFilterSetFactory(model)

    def filter_by_conditions(self, queryset, join_type, search_term=None, **kwargs):
        """
        Filtra un queryset con condiciones dinámicas basadas en SEARCHABLE_FIELDS.

        Args:
            queryset (QuerySet): QuerySet base a filtrar.
            search_term (str, opcional): Término de búsqueda general aplicado a SEARCHABLE_FIELDS.
            join_type (str, opcional): Tipo de lógica para combinar filtros básicos ("AND" o "OR").
            **kwargs: Filtros específicos definidos en SEARCHABLE_FIELDS.

        Ejemplo de Uso:
            -----------------
            SEARCHABLE_FIELDS = {
                'nombre': 'icontains',
                'edad': 'exact',
                'fecha_nacimiento': 'date_range',
            }

            queryset = MyModel.objects.all()
            search_filter = QuerysetFilter(MyModel)
            result = search_filter.filter_by_conditions(
                queryset=queryset,
                search_term="Juan",
                join_type="OR",
                nombre="Pedro",
                edad=30
            )
        Returns:
            QuerySet: QuerySet filtrado.
        """

        combined_conditions = Q()
        # Aplicar filtros básicos con el FilterSet dinámico
        if kwargs:
            basic_conditions = self.dynamic_filter_factory.filter_with_join_type(
                queryset=queryset, data=kwargs, join_type=join_type
            )
            combined_conditions &= basic_conditions

        # Construir condiciones basadas en el término general de búsqueda
        if search_term:
            for field, lookup in self.model.SEARCHABLE_FIELDS.items():
                if lookup == "date_range":
                    date_condition = self._build_date_condition(field, search_term)
                    if date_condition:
                        combined_conditions |= date_condition
                elif lookup == "int_exact":
                    try:
                        # Intentar convertir el término de búsqueda a entero
                        search_term_casted = int(search_term)
                        combined_conditions |= Q(**{f"{field}__exact": search_term_casted})
                    except ValueError:
                        # Si la conversión falla, ignorar este campo
                        continue
                else:
                    combined_conditions |= Q(**{f"{field}__{lookup}": search_term})
        # Aplicar las condiciones combinadas al QuerySet
        return queryset.filter(combined_conditions)

    def _build_date_condition(self, field, search_term):
        """
        Construye condiciones específicas para campos de tipo rango de fechas.

        Args:
            field (str): Nombre del campo de fecha.
            search_term (str): Término de búsqueda como rango o fecha exacta.

        Returns:
            Q: Condición de búsqueda de fechas.
        """
        try:
            if '&' in search_term:
                start, end = search_term.split('&')
                start_date = datetime.strptime(start.strip(), "%Y-%m-%d").date()
                end_date = datetime.strptime(end.strip(), "%Y-%m-%d").date()
                return Q(**{f"{field}__range": (start_date, end_date)})
            else:
                exact_date = datetime.strptime(search_term.strip(), "%Y-%m-%d").date()
                return Q(**{f"{field}__exact": exact_date})
        except ValueError:
            return None  # No es una fecha válida
