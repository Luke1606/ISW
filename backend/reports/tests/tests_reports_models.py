import pytest
from reports.models import Report
from users.tests.tests_users_models import student_user, professor_user


@pytest.mark.django_db
def test_create_report(student_user, professor_user):
    """Verifica que se pueda crear un reporte correctamente."""
    report = Report.objects.create(
        author=student_user.id,
        user_type=Report.UserType.STUDENT,
        users_info=[Report.DataType.REQUEST, Report.DataType.DEFENSE_ACT]
    )
    report.users.add(professor_user.id)

    assert report.id is not None
    assert report.author == student_user
    assert report.user_type == Report.UserType.STUDENT
    assert Report.DataType.REQUEST in report.users_info
    assert Report.DataType.DEFENSE_ACT in report.users_info


@pytest.mark.django_db
def test_create_report(student_user, professor_user):
    """Verifica que se pueda crear un reporte correctamente."""
    report1 = Report.objects.create(
        author=student_user.id,
        user_type=Report.UserType.STUDENT,
        users_info=[Report.DataType.REQUEST, Report.DataType.DEFENSE_ACT]
    )
    report1.users.add(professor_user.id)

    report2 = Report.objects.create(
        author=student_user.id,
        user_type=Report.UserType.STUDENT,
        users_info=[Report.DataType.REQUEST, Report.DataType.DEFENSE_ACT]
    )
    report2.users.add(professor_user.id)

    assert Report.objects.count() == 2
