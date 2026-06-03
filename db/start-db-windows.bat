@echo off
cd /d "%USERPROFILE%\GitHub\crumbskate\db" 2>nul || cd /d "%~dp0"
docker-compose up -d
