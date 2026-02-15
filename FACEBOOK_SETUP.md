# Facebook Login with Firebase Setup Guide

## Setup Steps:

### 1. Enable Facebook Authentication in Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **bdm-bazar-ecc13**
3. Go to **Authentication** → **Sign-in method**
4. Click on **Facebook** and enable it
5. Enter your Facebook credentials:
   - App ID: `2110849716334945`
   - App Secret: `839ee32f91d8de539d92e4d3e7b58343`
6. **Copy the OAuth redirect URI** shown by Firebase (looks like: `https://bdm-bazar-ecc13.firebaseapp.com/__/auth/handler`)
7. Click **Save**

### 2. Configure Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Select your app (ID: 2110849716334945)
3. Go to **Facebook Login** → **Settings**
4. Add to **Valid OAuth Redirect URIs**:
   - Paste the Firebase OAuth redirect URI from step 1.6 above
   - Example: `https://bdm-bazar-ecc13.firebaseapp.com/__/auth/handler`
5. Go to **Settings** → **Basic**
6. Add to **App Domains**:
   - `bdm-bazar-ecc13.firebaseapp.com`
   - `localhost` (for development)
7. Save changes

### 3. Test the Integration
1. Restart your Next.js dev server
2. Go to login page
3. Click "Continue with Facebook"
4. Firebase will handle the authentication popup

## How It Works:
- User clicks Facebook button
- Firebase opens Facebook login popup
- Facebook redirects to Firebase's handler
- Firebase returns user data
- App sends user data to your backend API
- User is logged in

## Files Modified:
- `src/lib/firebase.ts` - Firebase configuration with Facebook provider
- `src/lib/useFirebaseFacebookAuth.ts` - Firebase Facebook authentication hook
- `src/Component/forms/AuthForm.tsx` - Uses Firebase for Facebook login
- `.env.local` - Firebase and Facebook credentials

## Important:
The OAuth redirect URI **must be** the one provided by Firebase, not a custom NextAuth URL.
