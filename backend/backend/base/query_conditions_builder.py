from django.db.models import Q
from datetime import datetime


class QueryConditionBuilder:
    """
    Clase para construir dinámicamente condiciones de búsqueda con Q basadas en el campo SEARCHABLE_FIELDS.
    """
    def __init__(self, model, join_type="AND"):
        """
        Inicializa el constructor de condiciones dinámicas.

        Args:
            model (Model): Modelo de Django que contiene SEARCHABLE_FIELDS.
            join_type (str): Tipo de combinación lógica ("AND" o "OR").
        """
        self.model = model
        self.searchable_fields = getattr(model, "SEARCHABLE_FIELDS", {})
        self.join_type = join_type

    def build_conditions(self, search_term=None, **kwargs):
        """
        Construye condiciones dinámicas basadas en un término general de búsqueda y filtros específicos.

        Args:
            search_term (str): Término de búsqueda general (opcional).
            **kwargs: Filtros específicos definidos en SEARCHABLE_FIELDS.

        Returns:
            Q: Condiciones combinadas.
        """
        conditions = Q()

        # Construir condiciones basadas en el término general de búsqueda
        if search_term:
            for field, lookup in self.searchable_fields.items():
                if lookup == "date_range":
                    date_condition = self._build_date_condition(field, search_term)
                    if date_condition:
                        conditions |= date_condition
                else:
                    conditions |= Q(**{f"{field}__{lookup}": search_term})

        # Construir condiciones basadas en kwargs
        for key, value in kwargs.items():
            condition = Q(**{key: value})
            conditions = conditions | condition if self.join_type == "OR" else conditions & condition

        return conditions

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
