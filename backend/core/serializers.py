from rest_framework import serializers


class BaseListSerializer(serializers.ModelSerializer):
    """
    BaseSerializer específico para serializar datos destinados a listas de elementos.
    """
    id = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        abstract = True
        fields = ['id', 'name']  # Campos comunes: 'id' y 'name'

    def get_id(self, obj):
        """
        Método que a partir de este se guarda el resultado en el campo id.
        """
        return f"{obj.id}"

    def get_name(self, obj):
        """
        Método que los serializers hijos deben reimplementar para que a partir de este metodo
        se guarde el resultado en el campo name.
        Por defecto, lanza una excepción si no está implementado.
        """
        raise NotImplementedError(
            f"{self.__class__.__name__} debe implementar el método 'get_name'"
        )
