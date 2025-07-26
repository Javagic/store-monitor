@echo off
echo Uploading Store Monitor to DigitalOcean Droplet...

:: Create a temporary directory and copy files
mkdir temp_upload 2>nul
xcopy /E /Y /Q * temp_upload\ /EXCLUDE:upload_exclude.txt

:: Upload to droplet using SCP
echo Uploading files...
scp -r temp_upload/* root@209.38.105.200:/var/www/store-monitor/

:: Clean up
rmdir /S /Q temp_upload

echo Upload complete!
echo.
echo Next steps:
echo 1. SSH into your droplet: ssh root@209.38.105.200
echo 2. cd /var/www/store-monitor
echo 3. npm install
echo 4. Create .env file with your email settings
echo 5. pm2 start ecosystem.config.js
