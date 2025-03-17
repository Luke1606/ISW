"""
Este módulo proporciona una base para la definición de modelos en Django, incluyendo:

1. **BaseModel**:
   - Un modelo abstracto con un `id` único generado automáticamente (UUID).
   - Un campo `created_at` para registrar la fecha de creación.
   - Un atributo `SEARCHABLE_FIELDS` que permite definir dinámicamente los campos buscables y los tipos de filtrado asociados.

2. **BaseModelManager**:
   - Un manager personalizado con un método `search`, que utiliza `SEARCHABLE_FIELDS` para realizar búsquedas dinámicas sobre
   un queryset utilizando filtros definidos.

3. **BaseModelViewSet**:
   - Un ViewSet base que integra funcionalidad de filtrado dinámico basado en `SEARCHABLE_FIELDS`, utilizando la clase
   `DynamicFilterSetFactory`.

4. **DynamicFilterSetFactory**:
   - Una fábrica para generar clases `FilterSet` dinámicas basadas en los campos definidos en `SEARCHABLE_FIELDS` de un modelo.

Este módulo centraliza la lógica para simplificar y estructurar la creación, búsqueda y filtrado de modelos en proyectos de Django.
"""
