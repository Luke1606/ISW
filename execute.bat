@echo off

@REM REM Cambiar al directorio frontend
@REM cd frontend

@REM echo todo bien
@REM REM Instalar dependencias de npm
@REM npm install --force

@REM echo wtf

@REM IF ERRORLEVEL 1 (
@REM     echo Error al instalar dependencias de npm.
@REM     pause
@REM     exit /b 1
@REM )

@REM REM Cambiar al directorio backend
@REM cd ../backend

@REM REM Instalar dependencias de pip
@REM pip install -r requirements.txt
@REM IF ERRORLEVEL 1 (
@REM     echo Error al instalar dependencias de pip.
@REM     pause
@REM     exit /b 1
@REM )

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