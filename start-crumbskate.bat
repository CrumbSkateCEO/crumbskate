@echo off
cd /d "D:\GitHub\crumbskate" 2>nul || cd /d "%~dp0"
docker-compose up -d
timeout /t 5 /nobreak >nul
start http://localhost:3000
