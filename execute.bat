@echo off

REM Activar el entorno virtual
cd .venv\Scripts
call activate

REM Volver al directorio backend
cd ../../backend

REM Iniciar el servidor de Django Rest Framework
start cmd /k "python manage.py runserver"

REM Cambiar al directorio frontend
cd ../frontend

REM Iniciar la aplicación de React
start cmd /k "npm run dev"

pause