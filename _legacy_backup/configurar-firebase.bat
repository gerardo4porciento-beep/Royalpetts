@echo off
echo ========================================
echo Configuracion de Firebase para ROYALPETTS
echo ========================================
echo.
echo Paso 1: Iniciar sesion en Firebase
echo.
firebase login
echo.
echo Paso 2: Desplegar reglas de Firestore
echo.
firebase deploy --only firestore:rules
echo.
echo Paso 3: Verificar conexion
echo.
firebase projects:list
echo.
echo ========================================
echo Configuracion completada!
echo ========================================
pause



