@echo off
echo ==========================================
echo   AutoPrime - Executar sem Docker
echo ==========================================
echo.

set BACKEND_DIR=%~dp0backend
set FRONTEND_DIR=%~dp0frontend

REM Verifica se arquivos existem
if not exist "%BACKEND_DIR%\manage.py" goto erro_backend
if not exist "%FRONTEND_DIR%\index.html" goto erro_frontend

cd /d "%BACKEND_DIR%"

REM Cria ambiente virtual se nao existir
if not exist "venv\Scripts\activate.bat" (
    echo Criando ambiente virtual...
    python -m venv venv
)

echo Ativando venv...
call venv\Scripts\activate.bat

echo Instalando dependencias...
pip install -r requirements.txt

REM Verifica .env
if not exist ".env" (
    echo.
    echo [AVISO] Arquivo .env nao encontrado
    echo Configure backend\.env antes de continuar
    echo.
    pause
)

echo.
echo Garantindo banco de dados...
python -c "from decouple import config; import MySQLdb; db=config('DB_NAME', default='carro'); user=config('DB_USER', default='root'); pwd=config('DB_PASSWORD', default=''); host=config('DB_HOST', default='localhost'); port=int(config('DB_PORT', default='3306')); conn=MySQLdb.connect(host=host, user=user, passwd=pwd, port=port); cur=conn.cursor(); safe_db=db.replace('`',''); cur.execute('CREATE DATABASE IF NOT EXISTS `{}` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;'.format(safe_db)); conn.close(); print(f'Banco {safe_db} pronto');"

echo.
echo Iniciando BACKEND em http://127.0.0.1:8000 ...
start "Backend Django" cmd /k "cd /d %BACKEND_DIR% && call venv\Scripts\activate.bat && python manage.py migrate && python manage.py runserver"

echo.
echo Aguardando backend iniciar na porta 8000...
powershell -Command "Do { Start-Sleep -Milliseconds 500 } Until ((Test-NetConnection -ComputerName 127.0.0.1 -Port 8000 -WarningAction SilentlyContinue).TcpTestSucceeded)"

echo.
echo Iniciando FRONTEND em http://127.0.0.1:5500 ...
start "Frontend HTTP" cmd /k "cd /d %FRONTEND_DIR% && python -m http.server 5500"

timeout /t 3 >nul
start http://127.0.0.1:5500/

echo.
echo ==========================================
echo   Sistema iniciado!
echo   Backend:  http://127.0.0.1:8000
echo   Frontend: http://127.0.0.1:5500
echo ==========================================
echo.
echo Feche as janelas abertas para encerrar.
echo.
pause
exit

:erro_backend
echo [ERRO] Nao encontrei %BACKEND_DIR%\manage.py
pause
exit /b 1

:erro_frontend
echo [ERRO] Nao encontrei %FRONTEND_DIR%\index.html
pause
exit /b 1
