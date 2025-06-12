from users.serializers import CustomUserSerializer, StudentSerializer, ProfessorSerializer
from .tests_users_models import student_user, professor_user


def test_custom_user_serializer(student_user):
    """Verifica que el serializer de CustomUser serializa correctamente"""
    user = student_user.id
    user_data = CustomUserSerializer(user).data

    assert user_data["id"] == str(user.id)
    assert user_data["name"] == user.name
    assert user_data["username"] == user.username
    assert user_data["pic"] == user.pic
    assert user_data["user_role"] == user.user_role


def test_student_serializer(student_user):
    """Verifica que el serializer de Student serializa correctamente"""
    student_data = StudentSerializer(student_user).data
    user = CustomUserSerializer(student_user.id).data

    assert student_data["id"] == user
    assert student_data["faculty"] == student_user.faculty
    assert student_data["group"] == student_user.group


def test_professor_serializer(professor_user):
    """Verifica que el serializer de Professor serializa correctamente"""
    professor_data = ProfessorSerializer(professor_user).data
    user = CustomUserSerializer(professor_user.id).data

    assert professor_data["id"] == user
    assert professor_data["role"] == professor_user.role
