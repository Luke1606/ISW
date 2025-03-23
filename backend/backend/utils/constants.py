"""
Este modulo contiene los valores constantes utiles en la aplicacion.
"""


class DataTypes:
    """
    Esta clase dicta los distintos valores y roles para evitar duplicacion.
    """
    class User:
        """
        Esta clase dicta los distintos tipos de usuarios
        """
        student = "student"
        professor = "professor"
        dptoInf = "dptoInf"
        decan = "decan"
        roles = {student, professor, dptoInf, decan}

    evidence = "evidence"
    request = "request"
    defense_tribunal = "defense_tribunal"
    tribunal = "tribunal"
    defense_act = "defense_act"
