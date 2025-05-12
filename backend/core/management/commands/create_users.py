from users.models import CustomUser
from core.management.utils.constants import Datatypes

# Crear usuario Student
student_user = CustomUser.objects.create_user_by_role(
    role=Datatypes.User.student,
    username="student1",
    password="Password1.",
    name="Luis Estudiante",
    faculty='CITEC',
    group=101
)

# Crear usuario Decano
decan_user = CustomUser.objects.create_user_by_role(
    role=Datatypes.User.decan,
    username="decan1",
    password="Password1.",
    name="Luis Decano"
)

# Crear usuario Profesor
professor_user = CustomUser.objects.create_user_by_role(
    role=Datatypes.User.professor,
    username="professor1",
    password="Password1.",
    name="Luis Profesor"
)

# Crear usuario Departamento de Informática
dpto_inf_user = CustomUser.objects.create_user_by_role(
    role=Datatypes.User.dptoInf,
    username="dptoInf1",
    password="Password1.",
    name="Luis del Departamento Informática"
)

print("Usuarios creados correctamente.")
