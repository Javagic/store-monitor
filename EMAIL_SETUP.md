# Email Setup Guide for Kärcher Monitor

This guide will help you set up a simple email account for your monitoring project.

## Option 1: Gmail (Recommended)

### Step 1: Create a Gmail Account
1. Go to https://accounts.google.com/signup
2. Create a new account like: `karcher.monitor.yourname@gmail.com`
3. Use a simple password you'll remember

### Step 2: Enable App Passwords
1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Enable 2-Step Verification if not already enabled
4. Go to Security → App passwords
5. Generate an app password for "Mail"
6. Copy the 16-character app password

### Step 3: Configure the Project
Edit the `.env` file and replace:
```
EMAIL_SERVICE=gmail
EMAIL_USER=karcher.monitor.yourname@gmail.com
EMAIL_PASS=your_16_character_app_password
```

## Option 2: Outlook/Hotmail (Easier Setup)

### Step 1: Create Outlook Account
1. Go to https://outlook.live.com/owa/
2. Click "Create free account"
3. Create: `karcher.monitor.yourname@outlook.com`
4. No app passwords needed - just use your regular password!

### Step 2: Configure the Project
Edit the `.env` file:
```
EMAIL_SERVICE=hotmail
EMAIL_USER=karcher.monitor.yourname@outlook.com
EMAIL_PASS=your_regular_password
```

## Option 3: Yahoo Mail

### Step 1: Create Yahoo Account
1. Go to https://login.yahoo.com/account/create
2. Create account like: `karcher.monitor.yourname@yahoo.com`

### Step 2: Enable App Passwords (Required)
1. Go to Yahoo Account Security
2. Enable 2-step verification
3. Generate app password for "Mail"

### Step 3: Configure the Project
```
EMAIL_SERVICE=yahoo
EMAIL_USER=karcher.monitor.yourname@yahoo.com
EMAIL_PASS=your_app_password
```

## Option 4: ProtonMail (Privacy-Focused)

### Step 1: Create ProtonMail Account
1. Go to https://proton.me/mail
2. Create free account: `karcher.monitor.yourname@proton.me`

### Step 2: Configure with SMTP Bridge
```
# Use custom SMTP settings
SMTP_HOST=127.0.0.1
SMTP_PORT=1025
EMAIL_USER=karcher.monitor.yourname@proton.me
EMAIL_PASS=your_password
```
Note: Requires ProtonMail Bridge software

## Option 5: Temporary Email for Testing

For quick testing, you can use services like:
- **Temp Mail**: https://temp-mail.org/
- **10 Minute Mail**: https://10minutemail.com/
- **Guerrilla Mail**: https://www.guerrillamail.com/

Note: These are temporary and will expire, but good for initial testing.

## Testing Your Email Setup

Once configured, restart your server and test with:

```powershell
# Test notification
$testData = @{
    email = "your-test-email@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/items/test-notification" -Method POST -Body $testData -ContentType "application/json"
```

## Recommended Simple Setup

**Easiest Option: Outlook/Hotmail**
1. **Email**: `karcher.monitor.yourname@outlook.com`
2. **Reason**: No app passwords needed, just regular password
3. **Setup time**: 2 minutes

**Most Reliable: Gmail**
1. **Email**: `karcher.monitor.yourname@gmail.com` 
2. **Reason**: Best delivery rates, widely supported
3. **Setup time**: 5 minutes (due to app password setup)

**Privacy-Focused: ProtonMail**
1. **Email**: `karcher.monitor.yourname@proton.me`
2. **Reason**: Enhanced privacy and security
3. **Setup time**: 10 minutes (requires bridge software)

## Sample .env Configurations

### For Outlook (Easiest):
```env
EMAIL_SERVICE=hotmail
EMAIL_USER=karcher.monitor.test@outlook.com
EMAIL_PASS=your_simple_password
```

### For Gmail (Most Reliable):
```env
EMAIL_SERVICE=gmail
EMAIL_USER=karcher.monitor.test@gmail.com
EMAIL_PASS=abcd_efgh_ijkl_mnop  # 16-character app password
```

### For Yahoo:
```env
EMAIL_SERVICE=yahoo
EMAIL_USER=karcher.monitor.test@yahoo.com
EMAIL_PASS=your_app_password
```

### For Any Other Provider (Custom SMTP):
```env
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=karcher.monitor@yourdomain.com
EMAIL_PASS=your_password
```

## Troubleshooting

**Gmail Issues:**
- Make sure 2FA is enabled
- Use app password, not regular password
- Check "Less secure app access" if needed

**Outlook Issues:**
- May need to enable SMTP authentication
- Check spam folder for test emails

**General Issues:**
- Check server logs for error messages
- Verify internet connection
- Test with a simple email first
