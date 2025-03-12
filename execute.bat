@echo off

REM Cambiar al directorio frontend
cd frontend

REM Instalar dependencias de npm
npm install
IF ERRORLEVEL 1 (
    echo Error al instalar dependencias de npm.
    pause
    exit /b 1
)

REM Cambiar al directorio backend
cd ../backend

REM Instalar dependencias de pip
pip install -r requirements.txt
IF ERRORLEVEL 1 (
    echo Error al instalar dependencias de pip.
    pause
    exit /b 1
)

REM Activar el entorno virtual
cd .venv\Scripts
call activate

REM Volver al directorio backend
cd ../../backend

REM Iniciar el servidor de Django
start cmd /k "python manage.py runserver"

REM Cambiar al directorio frontend
cd ../frontend

REM Iniciar la aplicación de React
start cmd /k "npm run dev"

pause