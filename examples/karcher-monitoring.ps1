# Kärcher SC3 Monitoring Examples
# PowerShell commands to interact with your item monitor

Write-Host "=== Kärcher SC3 Monitor - Quick Commands ===" -ForegroundColor Green

# Get the current item ID dynamically
$items = Invoke-RestMethod -Uri "http://localhost:3000/api/items" -Method GET
$karcherItem = $items.items | Where-Object { $_.name -like "*SC3*" } | Select-Object -First 1

if (-not $karcherItem) {
    Write-Host "No Kärcher SC3 item found in monitoring!" -ForegroundColor Red
    exit
}

$itemId = $karcherItem.id
Write-Host "Found Kärcher item: $($karcherItem.name) (ID: $itemId)" -ForegroundColor Cyan

Write-Host ""
Write-Host "=== Quick Actions ===" -ForegroundColor Yellow

# 1. Check server status
Write-Host "1. Checking server status..." -ForegroundColor Gray
$health = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
Write-Host "   Server Status: $($health.status)"
Write-Host "   Monitored Items: $($health.monitored_items)"

# 2. View current item status
Write-Host ""
Write-Host "2. Current Kärcher SC3 status..." -ForegroundColor Gray
$items.items | Format-Table name, isAvailable, currentPrice, lastChecked

# 3. Manual check
Write-Host ""
Write-Host "3. Performing manual availability check..." -ForegroundColor Gray
try {
    $result = Invoke-RestMethod -Uri "http://localhost:3000/api/items/$itemId/check" -Method POST
    $item = $result.result
    
    Write-Host "   Item: $($item.name)" -ForegroundColor White
    Write-Host "   Available: $(if ($item.isAvailable) { '✅ YES' } else { '❌ NO' })" -ForegroundColor $(if ($item.isAvailable) { 'Green' } else { 'Red' })
    Write-Host "   Price: $($item.currentPrice) ₾" -ForegroundColor Cyan
    Write-Host "   Last Checked: $($item.lastChecked)" -ForegroundColor Gray
    Write-Host "   URL: $($item.url)" -ForegroundColor Blue
} catch {
    Write-Host "   Error checking item: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Available Commands ===" -ForegroundColor Yellow

Write-Host ""
Write-Host "📧 Subscribe to notifications:"
Write-Host @"
`$subscriptionData = @{
    userId = "your_name"
    email = "your-email@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/items/$itemId/subscribe" -Method POST -Body `$subscriptionData -ContentType "application/json"
"@ -ForegroundColor Cyan

Write-Host ""
Write-Host "🔍 Manual check:"
Write-Host "Invoke-RestMethod -Uri `"http://localhost:3000/api/items/$itemId/check`" -Method POST" -ForegroundColor Cyan

Write-Host ""
Write-Host "📧 Test email notifications:"
Write-Host @"
`$testNotification = @{
    email = "your-email@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/items/test-notification" -Method POST -Body `$testNotification -ContentType "application/json"
"@ -ForegroundColor Cyan

Write-Host ""
Write-Host "🔄 Check all items:"
Write-Host "Invoke-RestMethod -Uri `"http://localhost:3000/api/items/check-all`" -Method POST" -ForegroundColor Cyan

Write-Host ""
Write-Host "👤 View your subscriptions:"
Write-Host "Invoke-RestMethod -Uri `"http://localhost:3000/api/items/user/your_name`" -Method GET" -ForegroundColor Cyan

Write-Host ""
Write-Host "=== Setup Email ===" -ForegroundColor Green
Write-Host "Run: .\setup-email.ps1" -ForegroundColor White
Write-Host "This will help you configure email notifications step by step."

Write-Host ""
Write-Host "The server automatically checks every 5 minutes! 🔄" -ForegroundColor Green
