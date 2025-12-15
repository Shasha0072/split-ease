# Google OAuth Setup Guide for SplitEase

This guide will help you enable Google OAuth authentication in your Supabase project.

## Prerequisites

- Supabase project created (Split-Ease)
- Google account for Google Cloud Console access
- SplitEase app running locally

---

## Step 1: Create Google Cloud Project

### 1.1 Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Sign in with your Google account

### 1.2 Create a New Project
1. Click the project dropdown at the top (next to "Google Cloud")
2. Click "New Project"
3. Enter project details:
   - **Project Name:** `SplitEase`
   - **Organization:** (leave default or select your org)
4. Click "Create"
5. Wait for the project to be created (takes a few seconds)
6. Select your new project from the dropdown

---

## Step 2: Configure OAuth Consent Screen

### 2.1 Navigate to OAuth Consent Screen
1. In the left sidebar, go to: **APIs & Services** → **OAuth consent screen**
2. Or visit: https://console.cloud.google.com/apis/credentials/consent

### 2.2 Choose User Type
- Select **External** (allows anyone with a Google account)
- Click "Create"

### 2.3 Fill in App Information

**App Information:**
- **App name:** `SplitEase`
- **User support email:** Your email address
- **App logo:** (optional, skip for now)

**App Domain (Optional):**
- **Application home page:** `http://localhost:3000` (for development)
- **Application privacy policy link:** (skip for now)
- **Application terms of service link:** (skip for now)

**Authorized Domains:**
- Add: `supabase.co`

**Developer Contact Information:**
- **Email addresses:** Your email address

Click "Save and Continue"

### 2.4 Scopes
- Click "Add or Remove Scopes"
- Select these scopes:
  - `.../auth/userinfo.email`
  - `.../auth/userinfo.profile`
  - `openid`
- Click "Update"
- Click "Save and Continue"

### 2.5 Test Users (Optional for Development)
- Add your email and any test users
- Click "Save and Continue"

### 2.6 Summary
- Review your settings
- Click "Back to Dashboard"

---

## Step 3: Create OAuth Credentials

### 3.1 Navigate to Credentials
1. In the left sidebar: **APIs & Services** → **Credentials**
2. Or visit: https://console.cloud.google.com/apis/credentials

### 3.2 Create OAuth Client ID
1. Click "**+ Create Credentials**" at the top
2. Select "**OAuth client ID**"

### 3.3 Configure OAuth Client

**Application Type:**
- Select: **Web application**

**Name:**
- Enter: `SplitEase Web Client`

**Authorized JavaScript Origins:**
- Click "+ Add URI"
- Add: `http://localhost:3000` (for local development)
- Click "+ Add URI" again
- Add: `https://dvbmtcwvnhnrsgtpseku.supabase.co`

**Authorized Redirect URIs:**
- Click "+ Add URI"
- Add: `https://dvbmtcwvnhnrsgtpseku.supabase.co/auth/v1/callback`
- Click "+ Add URI" again (for local testing)
- Add: `http://localhost:54321/auth/v1/callback`

Click "**Create**"

### 3.4 Save Your Credentials
A popup will appear with your credentials:

```
Client ID: 123456789-abcdefghijklmnop.apps.googleusercontent.com
Client Secret: GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ
```

**IMPORTANT:** Copy both values! You'll need them in the next step.

Click "**OK**"

---

## Step 4: Configure Supabase

### 4.1 Go to Supabase Dashboard
- Visit: https://supabase.com/dashboard/project/dvbmtcwvnhnrsgtpseku
- Navigate to: **Authentication** → **Providers**

### 4.2 Enable Google Provider
1. Find "**Google**" in the providers list
2. Toggle the switch to **Enabled**

### 4.3 Add Google Credentials
Paste the credentials from Step 3.4:

- **Client ID (for OAuth):** `123456789-abcdefghijklmnop.apps.googleusercontent.com`
- **Client Secret (for OAuth):** `GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ`

### 4.4 Save Configuration
- Click "**Save**" at the bottom

---

## Step 5: Test Google OAuth

### 5.1 Start Your Development Server
```bash
cd c:\Users\ShashwatAdhau\Documents\split-ease
npm run dev
```

### 5.2 Test Login Flow
1. Open your browser: http://localhost:3000/login
2. Click "**Sign in with Google**"
3. You should be redirected to Google's sign-in page
4. Choose your Google account
5. Grant permissions
6. You'll be redirected back to your dashboard

### 5.3 Verify in Supabase
1. Go to: **Authentication** → **Users**
2. You should see your new user account
3. Provider should show as "google"

---

## Step 6: Production Configuration (Future)

When deploying to production (e.g., Vercel):

### 6.1 Update Authorized Origins
In Google Cloud Console → Credentials:
- Add your production domain: `https://split-ease.vercel.app`

### 6.2 Update Authorized Redirect URIs
- Add: `https://split-ease.vercel.app/auth/callback`

### 6.3 Update Environment Variables
In Vercel:
```bash
NEXT_PUBLIC_APP_URL=https://split-ease.vercel.app
```

---

## Troubleshooting

### Error: "Access blocked: This app's request is invalid"
**Solution:** Make sure you've added the correct Authorized Redirect URI:
```
https://dvbmtcwvnhnrsgtpseku.supabase.co/auth/v1/callback
```

### Error: "Redirect URI mismatch"
**Solution:**
1. Double-check the redirect URI in Google Cloud Console
2. Make sure there are no trailing slashes
3. The URI must match exactly

### Error: "Invalid OAuth client"
**Solution:**
1. Verify Client ID and Secret in Supabase are correct
2. Make sure there are no extra spaces when copying/pasting
3. Try regenerating the credentials in Google Cloud Console

### Google Sign-In Button Not Working
**Solution:**
1. Check browser console for errors
2. Make sure your app is running on the correct port
3. Verify environment variables are loaded (restart dev server)

### Users Not Being Created in Database
**Solution:**
The `users` table needs to be populated when a user signs up. You may need to:
1. Add a database trigger or
2. Create the user record in the `users` table after signup

We'll implement this in the next step!

---

## Security Best Practices

### For Development
- ✅ Use test accounts only
- ✅ Don't share Client Secret publicly
- ✅ Keep `.env.local` in `.gitignore`

### For Production
- ✅ Use environment variables for secrets
- ✅ Enable only necessary OAuth scopes
- ✅ Regularly rotate OAuth credentials
- ✅ Monitor OAuth usage in Google Cloud Console
- ✅ Set up proper privacy policy and terms of service
- ✅ Submit app for verification if reaching >100 users

---

## Quick Reference

### Important URLs
- **Google Cloud Console:** https://console.cloud.google.com/
- **Supabase Dashboard:** https://supabase.com/dashboard/project/dvbmtcwvnhnrsgtpseku
- **OAuth Consent Screen:** https://console.cloud.google.com/apis/credentials/consent
- **Credentials:** https://console.cloud.google.com/apis/credentials

### Redirect URI Format
```
https://[PROJECT-REF].supabase.co/auth/v1/callback
```

For this project:
```
https://dvbmtcwvnhnrsgtpseku.supabase.co/auth/v1/callback
```

---

## Next Steps

After setting up Google OAuth:

1. **Test the Authentication Flow**
   - Sign up with Google
   - Sign in with Google
   - Check user data in Supabase

2. **Create User Profile on First Login**
   - Add database trigger or hook
   - Populate `users` table with Google profile data

3. **Add Email Verification** (optional)
   - Configure email templates in Supabase
   - Set up SMTP provider

4. **Production Deployment**
   - Update OAuth credentials with production URLs
   - Test on production domain

---

**Need Help?**
- Supabase Docs: https://supabase.com/docs/guides/auth/social-login/auth-google
- Google OAuth Docs: https://developers.google.com/identity/protocols/oauth2

**Last Updated:** December 15, 2024
