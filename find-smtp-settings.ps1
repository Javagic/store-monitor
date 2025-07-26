# AtomicMail SMTP Configuration Helper

Write-Host "=== Finding AtomicMail SMTP Settings ===" -ForegroundColor Green
Write-Host ""

Write-Host "Your email: notifyingserver@atomicmail.io" -ForegroundColor Cyan
Write-Host "Password: sgag22gerg!@" -ForegroundColor Cyan
Write-Host ""

Write-Host "Common SMTP server names to try:" -ForegroundColor Yellow
$smtpOptions = @(
    "smtp.atomicmail.io",
    "mail.atomicmail.io", 
    "smtp.mail.atomicmail.io",
    "outgoing.atomicmail.io",
    "atomicmail.io"
)

foreach ($smtp in $smtpOptions) {
    Write-Host "• $smtp" -ForegroundColor White
}

Write-Host ""
Write-Host "Port options to try:" -ForegroundColor Yellow
Write-Host "• 587 (STARTTLS)" -ForegroundColor White
Write-Host "• 465 (SSL)" -ForegroundColor White  
Write-Host "• 25 (Plain)" -ForegroundColor White

Write-Host ""
Write-Host "=== How to Find Your SMTP Settings ===" -ForegroundColor Green
Write-Host ""
Write-Host "1. 📧 Check AtomicMail Documentation:" -ForegroundColor Cyan
Write-Host "   • Look for 'SMTP settings' or 'Email client setup'"
Write-Host "   • Check their help/support section"
Write-Host ""
Write-Host "2. 🔍 Try Common Settings:" -ForegroundColor Cyan
Write-Host "   • Most email providers use: smtp.[domain]"
Write-Host "   • Port 587 with STARTTLS is most common"
Write-Host ""
Write-Host "3. 📞 Contact AtomicMail Support:" -ForegroundColor Cyan  
Write-Host "   • Ask for SMTP server settings"
Write-Host "   • Mention you want to use with an application"
Write-Host ""
Write-Host "4. 🔧 Test Configuration:" -ForegroundColor Cyan
Write-Host "   • Edit .env file with correct settings"
Write-Host "   • Restart server and test with: .\examples\karcher-monitoring.ps1"

Write-Host ""
Write-Host "=== Alternative: Use a Known Provider ===" -ForegroundColor Green
Write-Host ""
Write-Host "If AtomicMail is difficult to configure, you can:" -ForegroundColor Yellow
Write-Host "1. Create a quick Outlook account: test.monitor@outlook.com"
Write-Host "2. Use it for this project"
Write-Host "3. Forward emails to your AtomicMail if needed"

Write-Host ""
Write-Host "Current Status: Monitoring works, notifications show in console" -ForegroundColor Green
Write-Host "Your Kärcher SC3 is being monitored every 5 minutes! 🔄" -ForegroundColor Cyan
