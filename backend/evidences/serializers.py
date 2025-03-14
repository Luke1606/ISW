from rest_framework import serializers
from .models import Evidence


class EvidenceSerializer(serializers.ModelSerializer):
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
