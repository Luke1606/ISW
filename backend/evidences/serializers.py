from rest_framework import serializers
from core.serializers import BaseListSerializer
from users.models import Student
from .models import Evidence


class EvidenceListSerializer(BaseListSerializer):
    class Meta:
        model = Evidence
        fields = BaseListSerializer.Meta.fields

    def get_id(self, obj):
        return f"{obj.id}"

    def get_name(self, obj):
        """
        Combina first_name y last_name del usuario.
        """
        return f"{obj.name}"


class EvidenceFullSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())

    class Meta:
        model = Evidence
        fields = "__all__"

    def validate(self, attrs):
        attachment_type = attrs.get('attachment_type')
        attachment_file = attrs.get('attachment_file')
        attachment_url = attrs.get('attachment_url')

        if attachment_type == Evidence.Type.URL and not attachment_url:
            raise serializers.ValidationError('URL field must be provided when attachment type is URL.')
        if attachment_type == Evidence.Type.FILE and not attachment_file:
            raise serializers.ValidationError('File field must be provided when attachment type is FILE.')
        if attachment_type == Evidence.Type.URL and attachment_file:
            raise serializers.ValidationError('File field must be empty when attachment type is URL.')
        if attachment_type == Evidence.Type.FILE and attachment_url:
            raise serializers.ValidationError('URL field must be empty when attachment type is FILE.')

        return attrs
