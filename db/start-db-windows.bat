@echo off
cd /d "%USERPROFILE%\Desktop\crumbskate-main\db" 2>nul || cd /d "%~dp0"
docker-compose up -d
