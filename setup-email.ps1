# Email Setup and Test Script for Kärcher Monitor
# Run this script to configure and test your email setup

Write-Host "=== Kärcher Monitor Email Setup ===" -ForegroundColor Green
Write-Host ""

# Check if .env file exists
if (Test-Path ".env") {
    Write-Host "✓ .env file found" -ForegroundColor Green
} else {
    Write-Host "✗ .env file not found. Creating from template..." -ForegroundColor Red
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created from template" -ForegroundColor Green
}

Write-Host ""
Write-Host "Current email configuration:" -ForegroundColor Yellow

# Read current configuration
$envContent = Get-Content ".env"
$emailUser = ($envContent | Where-Object { $_ -like "EMAIL_USER=*" }) -replace "EMAIL_USER=", ""
$emailService = ($envContent | Where-Object { $_ -like "EMAIL_SERVICE=*" }) -replace "EMAIL_SERVICE=", ""
$emailPass = ($envContent | Where-Object { $_ -like "EMAIL_PASS=*" }) -replace "EMAIL_PASS=", ""

Write-Host "Email Service: $emailService"
Write-Host "Email User: $emailUser"
Write-Host "Email Pass: $(if ($emailPass) { '*' * $emailPass.Length } else { 'Not set' })"

Write-Host ""
Write-Host "=== Quick Setup Options ===" -ForegroundColor Cyan

Write-Host "1. Outlook/Hotmail (Easiest)"
Write-Host "   - Create account: karcher.monitor.yourname@outlook.com"
Write-Host "   - Use regular password (no app password needed)"
Write-Host "   - Setup time: 2 minutes"

Write-Host ""
Write-Host "2. Gmail (Most Reliable)"
Write-Host "   - Create account: karcher.monitor.yourname@gmail.com"
Write-Host "   - Enable 2FA and generate app password"
Write-Host "   - Setup time: 5 minutes"

Write-Host ""
Write-Host "3. Yahoo Mail"
Write-Host "   - Create account: karcher.monitor.yourname@yahoo.com"
Write-Host "   - Enable 2FA and generate app password"
Write-Host "   - Setup time: 3 minutes"

Write-Host ""
Write-Host "4. Skip Email (Log Only)"
Write-Host "   - Notifications will only appear in console logs"
Write-Host "   - Good for initial testing"

Write-Host ""
$choice = Read-Host "Choose option (1, 2, 3, 4, or press Enter to continue with current settings)"

switch ($choice) {
    "1" {
        Write-Host "Setting up Outlook/Hotmail configuration..." -ForegroundColor Yellow
        $email = Read-Host "Enter your Outlook address (e.g., karcher.monitor.yourname@outlook.com)"
        $password = Read-Host "Enter your Outlook password" -AsSecureString
        $passwordText = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
        
        # Update .env file
        (Get-Content ".env") -replace "^#?\s*EMAIL_SERVICE=.*", "EMAIL_SERVICE=hotmail" | Set-Content ".env"
        (Get-Content ".env") -replace "^#?\s*EMAIL_USER=.*", "EMAIL_USER=$email" | Set-Content ".env"
        (Get-Content ".env") -replace "^#?\s*EMAIL_PASS=.*", "EMAIL_PASS=$passwordText" | Set-Content ".env"
        
        Write-Host "✓ Outlook configuration saved" -ForegroundColor Green
    }
    "2" {
        Write-Host "Setting up Gmail configuration..." -ForegroundColor Yellow
        $email = Read-Host "Enter your Gmail address (e.g., karcher.monitor.yourname@gmail.com)"
        $appPassword = Read-Host "Enter your Gmail app password (16 characters)" -AsSecureString
        $appPasswordText = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($appPassword))
        
        # Update .env file
        (Get-Content ".env") -replace "^#?\s*EMAIL_SERVICE=.*", "EMAIL_SERVICE=gmail" | Set-Content ".env"
        (Get-Content ".env") -replace "^#?\s*EMAIL_USER=.*", "EMAIL_USER=$email" | Set-Content ".env"
        (Get-Content ".env") -replace "^#?\s*EMAIL_PASS=.*", "EMAIL_PASS=$appPasswordText" | Set-Content ".env"
        
        Write-Host "✓ Gmail configuration saved" -ForegroundColor Green
    }
    "3" {
        Write-Host "Setting up Yahoo configuration..." -ForegroundColor Yellow
        $email = Read-Host "Enter your Yahoo address (e.g., karcher.monitor.yourname@yahoo.com)"
        $appPassword = Read-Host "Enter your Yahoo app password" -AsSecureString
        $appPasswordText = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($appPassword))
        
        # Update .env file
        (Get-Content ".env") -replace "^#?\s*EMAIL_SERVICE=.*", "EMAIL_SERVICE=yahoo" | Set-Content ".env"
        (Get-Content ".env") -replace "^#?\s*EMAIL_USER=.*", "EMAIL_USER=$email" | Set-Content ".env"
        (Get-Content ".env") -replace "^#?\s*EMAIL_PASS=.*", "EMAIL_PASS=$appPasswordText" | Set-Content ".env"
        
        Write-Host "✓ Yahoo configuration saved" -ForegroundColor Green
    }
    "4" {
        Write-Host "Disabling email notifications (log only mode)..." -ForegroundColor Yellow
        # Comment out email settings
        (Get-Content ".env") -replace "^EMAIL_SERVICE=", "# EMAIL_SERVICE=" | Set-Content ".env"
        (Get-Content ".env") -replace "^EMAIL_USER=", "# EMAIL_USER=" | Set-Content ".env"
        (Get-Content ".env") -replace "^EMAIL_PASS=", "# EMAIL_PASS=" | Set-Content ".env"
        
        Write-Host "✓ Email disabled - notifications will appear in console only" -ForegroundColor Green
    }
    default {
        Write-Host "Continuing with current settings..." -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "=== Testing Email Configuration ===" -ForegroundColor Cyan

$testEmail = Read-Host "Enter email address to send test notification to (your personal email)"

if ($testEmail) {
    Write-Host "Sending test notification to $testEmail..." -ForegroundColor Yellow
    
    try {
        $testData = @{
            email = $testEmail
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/items/test-notification" -Method POST -Body $testData -ContentType "application/json"
        
        if ($response.success) {
            Write-Host "✓ Test notification sent successfully!" -ForegroundColor Green
            Write-Host "Check your inbox (and spam folder) for the test email." -ForegroundColor Yellow
        } else {
            Write-Host "✗ Test failed: $($response.error)" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ Test failed. Server might not be running or email not configured." -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Make sure to restart the server after changing email settings:" -ForegroundColor Yellow
        Write-Host "Press Ctrl+C in the server terminal, then run: npm run dev" -ForegroundColor Cyan
    }
} else {
    Write-Host "Skipping email test." -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Green
Write-Host "1. If you changed email settings, restart the server:"
Write-Host "   - Press Ctrl+C in server terminal"
Write-Host "   - Run: npm run dev"
Write-Host ""
Write-Host "2. Subscribe to Kärcher notifications:"
Write-Host "   See examples/karcher-monitoring.ps1 for commands"
Write-Host ""
Write-Host "3. The server will check every 5 minutes automatically"
Write-Host ""
Write-Host "Email setup complete! 🎉" -ForegroundColor Green
