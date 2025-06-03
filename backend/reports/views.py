from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
from django.http import FileResponse

from core.management.utils.constants import Datatypes
from users.models import Student, Professor
from .models import Report

CATEGORY_MAPPING = {
    Datatypes.request: "Solicitudes",
    Datatypes.evidence: "Evidencias",
    Datatypes.defense_act: "Actas de defensa",
    Datatypes.defense_tribunal: "Tribunal y defensa"
}


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
        spanish_categories_to_report = [CATEGORY_MAPPING[category] for category in categories_to_report]

        # Obtener datos de estudiantes o profesores según `userType`
        if user_type == Datatypes.User.student:
            queryset = Student.objects.filter(id__in=selected_users)

            # Verificar que el estudiante solo pueda reportar su propia información
            if user_role == Datatypes.User.student and (queryset.count() > 1 or not queryset.filter(id=request.user.id).exists()):
                return Response(
                    {"error": "Los estudiantes solo pueden reportar su propia información."},
                    status=status.HTTP_403_FORBIDDEN
                )
            if user_role == Datatypes.User.professor:
                professor = request.user.professor
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
        else:
            return Response({"error": "Tipo de usuario no válido"}, status=status.HTTP_400_BAD_REQUEST)

        # Crear el PDF
        buffer = BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=letter)
        pdf.setTitle("Reporte de usuarios")

        spanish_usertype = 'estudiantes' if user_type == Datatypes.User.student else 'profesores'

        text = pdf.beginText(100, 750)

        pdf.setFont("Helvetica-Bold", 14)
        pdf.drawString(100, 750, f"Reporte de {spanish_usertype}")
        pdf.setFont("Helvetica", 12)

        text.textLine("")
        text.textLines(f"Categorías incluidas: {', '.join(spanish_categories_to_report)}")
        text.textLine("")

        for user in queryset:
            text.textLines(str(user))
            text.textLine("")

            # Recorrer todas las categorías relacionadas del usuario
            for category in categories_to_report:
                category_attr = category.lower().replace(" ", "_")
                related_objects = getattr(user, category_attr, None)

                if related_objects is None:
                    user_category_data = ["No disponible"]

                elif hasattr(related_objects, "all"):
                    obj_list = list(related_objects.all())
                    user_category_data = [str(obj) for obj in obj_list] if obj_list else ["No hay elementos"]

                else:
                    user_category_data = [str(related_objects)]

                data_string = "\n".join(user_category_data)

                text.textLine("")
                text.textLine(CATEGORY_MAPPING.get(category))
                text.textLine("--------------------------------------------------------------------------")
                text.textLines(data_string)
                text.textLine("")

        pdf.drawText(text)  # Dibujar el objeto de texto en el PDF
        pdf.showPage()
        pdf.save()
        buffer.seek(0)

        report = Report.objects.create(
            author=request.user,
            user_type=user_type,
            users_info=selected_users_info
        )

        report.users.set(selected_users)

        # Enviar PDF en la respuesta
        return FileResponse(buffer, as_attachment=True, filename="Reporte.pdf")
