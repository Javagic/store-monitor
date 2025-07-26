@echo off
echo Uploading Erix Clean Hub to DigitalOcean Droplet...

:: Create a temporary directory and copy files
if exist temp_upload rmdir /S /Q temp_upload
mkdir temp_upload

:: Copy specific files and folders (avoid cyclic copy)
echo Copying server files...
copy server.js temp_upload\
copy package*.json temp_upload\
copy ecosystem.config.js temp_upload\
copy .env.example temp_upload\

echo Copying source code...
xcopy /E /Y /Q src temp_upload\src\
xcopy /E /Y /Q public temp_upload\public\
xcopy /E /Y /Q deploy temp_upload\deploy\

:: Upload to droplet using SCP
echo Uploading files to droplet...
scp -r temp_upload/* root@209.38.105.200:/var/www/store-monitor/

:: Clean up
rmdir /S /Q temp_upload

echo Upload complete!
echo.
echo Next steps:
echo 1. SSH into your droplet: ssh root@209.38.105.200
echo 2. cd /var/www/store-monitor  
echo 3. npm install
echo 4. cp .env.example .env
echo 5. nano .env (add your OpenAI API key)
echo 6. pm2 start ecosystem.config.js
echo 7. pm2 save
