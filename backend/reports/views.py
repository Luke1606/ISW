from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
from django.http import FileResponse

from core.management.utils.constants import Datatypes
from users.models import Student, Professor
from users.serializers import StudentSerializer, ProfessorSerializer


class ReportView(APIView):
    def post(self, request, *args, **kwargs):
        user_role = request.user.user_role  # Extrae el rol del usuario autenticado
        user_type = request.data.get("type")
        selected_users = request.data.get("users", [])
        selected_users_info = request.data.get("infos", [])

        # Determinar categorías según el rol
        if user_role == Datatypes.User.student:
            allowed_categories = [
                Datatypes.request,
                Datatypes.evidence,
                Datatypes.defense_tribunal
            ]
        elif user_role == Datatypes.User.decan:
            allowed_categories = [
                Datatypes.request,
                Datatypes.evidence,
                Datatypes.defense_act,
                Datatypes.defense_tribunal,
            ] if user_type == Datatypes.User.student else [Datatypes.defense_act]
        else:
            allowed_categories = [
                Datatypes.request,
                Datatypes.evidence,
                Datatypes.defense_act,
                Datatypes.defense_tribunal,
            ]

        # Filtrar las categorías válidas
        categories_to_report = [
            category for category in selected_users_info if category in allowed_categories
        ]

        # Obtener datos de estudiantes o profesores según `userType`
        if user_type == Datatypes.User.student:
            queryset = Student.objects.filter(id__in=selected_users)
            serializer_class = StudentSerializer

            # Verificar que el estudiante solo pueda reportar su propia información
            if user_role == Datatypes.User.student and (queryset.count() > 1 or not queryset.filter(id=request.user.id).exists()):
                return Response(
                    {"error": "Los estudiantes solo pueden reportar su propia información."},
                    status=status.HTTP_403_FORBIDDEN
                )
            if user_role == Datatypes.User.professor:
                professor = Professor.objects.get(id=request.user)
                if queryset.values_list("id", flat=True) not in professor.get_related_students_ids():
                    return Response(
                        {"error": "Los profesores solo pueden reportar la información de sus estudiantes relacionados."},
                        status=status.HTTP_403_FORBIDDEN
                    )

        elif user_type == Datatypes.User.professor:
            if user_role != Datatypes.User.decan:
                return Response(
                    {"error": "Solo los decanos pueden reportar información de profesores."},
                    status=status.HTTP_403_FORBIDDEN
                )
            queryset = Professor.objects.filter(id__in=selected_users)
            serializer_class = ProfessorSerializer
        else:
            return Response({"error": "Tipo de usuario no válido"}, status=status.HTTP_400_BAD_REQUEST)

        # Serializar datos
        serialized_data = serializer_class(queryset, many=True).data

        # Crear el PDF
        buffer = BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=letter)
        pdf.setTitle("Reporte de Usuarios")

        pdf.drawString(100, 750, f"Reporte de {user_type}s")
        pdf.drawString(100, 730, f"Categorías incluidas: {', '.join(categories_to_report)}")

        y_position = 700
        for user in serialized_data:
            pdf.drawString(100, y_position, f"ID: {user['id']}, Nombre: {user['name']}")
            y_position -= 20

        pdf.showPage()
        pdf.save()
        buffer.seek(0)

        # Enviar PDF en la respuesta
        return FileResponse(buffer, as_attachment=True, filename="Reporte.pdf")
