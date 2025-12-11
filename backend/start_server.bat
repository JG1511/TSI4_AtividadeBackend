@echo off
echo ========================================
echo    AutoPrime Backend - Iniciando...
echo ========================================
echo.

REM Ativa o ambiente virtual (se existir)
if exist venv\Scripts\activate.bat (
    echo Ativando ambiente virtual...
    call venv\Scripts\activate.bat
)

REM Executa as migrações
echo Aplicando migrações...
python manage.py migrate

REM Inicia o servidor
echo.
echo ========================================
echo Servidor iniciado em: http://127.0.0.1:8000
echo Pressione Ctrl+C para encerrar
echo ========================================
echo.
python manage.py runserver

pause
