# 51Skills Authentication Guide

Complete guide for implementing and using the authentication system.

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Setup](#setup)
4. [API Routes](#api-routes)
5. [Frontend Pages](#frontend-pages)
6. [Token Management](#token-management)
7. [Security](#security)
8. [Troubleshooting](#troubleshooting)

---

## Overview

51Skills uses a complete JWT-based authentication system with the following capabilities:
- User registration and email verification
- Secure login/logout
- Password reset via email OTP
- Password change for authenticated users
- Automatic token refresh
- Protected routes

**Backend**: `https://srv746619.hstgr.cloud/api/v1/auth`

---

## Features

### ✅ Implemented Features

#### User Registration
- Signup with email, username, password
- Email verification via OTP
- Resend OTP with 60-second cooldown
- Validation for all fields

#### Authentication
- Login with email/password
- JWT token stored in HTTP-only cookies
- Auto token refresh every 30 minutes
- Secure logout with cookie clearing

#### Password Management
- Forgot password with email OTP
- Reset password after OTP verification
- Change password (requires authentication)
- Password strength validation

#### Security
- HTTP-only cookies
- CSRF protection (SameSite)
- Secure cookies in production
- Token expiry and refresh
- Protected routes

---

## Setup

### 1. Environment Variables

Create `.env.local`:
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://srv746619.hstgr.cloud/api/v1
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
```

---

## API Routes

All API routes are in `/app/api/auth/`:

```
/api/auth/
├── signup/route.ts           - User registration
├── login/route.ts            - User login
├── logout/route.ts           - User logout
├── verify/route.ts           - Token verification
├── verify-email/route.ts     - Email verification
├── resend-otp/route.ts       - Resend OTP
├── forgot-password/route.ts  - Request password reset
├── verify-forgot-password/route.ts - Verify reset OTP
├── reset-password/route.ts   - Reset password
├── change-password/route.ts  - Change password
└── refresh-token/route.ts    - Refresh JWT token
```

### Creating New API Routes

Template for new auth routes:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Call backend API
    const response = await fetch('https://srv746619.hstgr.cloud/api/v1/auth/endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
```

---

## Frontend Pages

### Public Pages
```
/auth                    - Login/Signup
/auth/forgot-password    - Request password reset
/auth/reset-password     - Reset password with OTP
/about                   - About page
/contact                 - Contact page
```

### Protected Pages
```
/dashboard               - User dashboard
/profile                 - User profile
/auth/change-password    - Change password
```

### Page Structure

#### Protected Page Template

```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          router.push("/auth");
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return <div>Protected Content</div>;
}
```

---

## Token Management

### Automatic Token Refresh

The dashboard automatically refreshes tokens every 30 minutes:

```typescript
useEffect(() => {
  const refreshInterval = setInterval(async () => {
    try {
      await fetch("/api/auth/refresh-token", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
  }, 30 * 60 * 1000); // 30 minutes

  return () => clearInterval(refreshInterval);
}, []);
```

### Manual Token Refresh

```typescript
import { refreshToken } from '@/utils/auth';

const handleRefresh = async () => {
  const result = await refreshToken();
  if (result.success) {
    console.log('Token refreshed successfully');
  }
};
```

### Using AuthProvider

Wrap your protected pages:

```typescript
import AuthProvider from '@/components/AuthProvider';

export default function MyPage() {
  return (
    <AuthProvider requireAuth={true}>
      <YourContent />
    </AuthProvider>
  );
}
```

---

## Security

### Cookie Configuration

```typescript
{
  httpOnly: true,              // Cannot access via JavaScript
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
  sameSite: 'lax',            // CSRF protection
  maxAge: 60 * 60 * 24 * 7,   // 7 days
  path: '/',                   // Available on all routes
}
```

### Password Requirements

- Minimum 6 characters
- Must be different from old password (change password)
- Must match confirmation field

### OTP Security

- 6-digit numeric code
- Sent via email only
- 60-second resend cooldown
- Single-use verification

### Best Practices

1. **Never store tokens in localStorage**
   - Use HTTP-only cookies only
   - Prevents XSS attacks

2. **Always use credentials: 'include'**
   - Ensures cookies are sent with requests
   - Required for authentication

3. **Verify authentication on protected routes**
   - Check on component mount
   - Redirect if not authenticated

4. **Clear data on logout**
   - Clear cookies
   - Clear localStorage
   - Redirect to login

5. **Handle token expiry**
   - Auto-refresh before expiry
   - Redirect to login if refresh fails

---

## Troubleshooting

### Common Issues

#### 1. "No token found" error
**Solution**: Ensure `credentials: 'include'` is set in fetch requests

```typescript
fetch('/api/auth/endpoint', {
  credentials: 'include', // ← Important!
})
```

#### 2. Redirect loop on protected pages
**Solution**: Check if token is being set correctly after login

```typescript
// After successful login
const response = await fetch('/api/auth/login', {
  credentials: 'include', // ← Must include
  // ...
});
```

#### 3. Token not refreshing
**Solution**: Verify refresh interval is set up correctly

```typescript
// Should be in useEffect with cleanup
useEffect(() => {
  const interval = setInterval(/* ... */, 30 * 60 * 1000);
  return () => clearInterval(interval); // ← Cleanup
}, []);
```

#### 4. CORS errors
**Solution**: Backend must allow credentials

Backend should have:
```
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: <your-domain>
```

#### 5. OTP not received
**Solutions**:
- Check spam folder
- Verify email is correct
- Try resend OTP (after 60 seconds)
- Check backend email service

#### 6. "Session expired" after refresh
**Solution**: Token might be invalid, logout and login again

```typescript
// Force logout
await fetch('/api/auth/logout', {
  method: 'POST',
  credentials: 'include',
});
localStorage.clear();
router.push('/auth');
```

---

## Testing

### Manual Testing Checklist

#### Registration Flow
- [ ] Signup with valid data
- [ ] Signup with existing email (should fail)
- [ ] Receive OTP email
- [ ] Verify email with correct OTP
- [ ] Verify email with wrong OTP (should fail)
- [ ] Resend OTP
- [ ] Check 60-second cooldown

#### Login Flow
- [ ] Login with verified account
- [ ] Login with unverified account (should fail)
- [ ] Login with wrong password (should fail)
- [ ] Check token is set in cookies
- [ ] Redirect to dashboard

#### Password Reset Flow
- [ ] Request password reset
- [ ] Receive OTP email
- [ ] Verify OTP
- [ ] Reset password
- [ ] Login with new password

#### Protected Routes
- [ ] Access dashboard when logged in
- [ ] Access dashboard when logged out (should redirect)
- [ ] Token auto-refresh works
- [ ] Logout clears session

#### Change Password
- [ ] Change password with correct old password
- [ ] Change password with wrong old password (should fail)
- [ ] Login with new password

---

## API Response Examples

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": { /* user object */ }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Utility Functions Reference

### refreshToken()
Manually refresh the JWT token
```typescript
const result = await refreshToken();
```

### verifyAuth()
Check if user is authenticated
```typescript
const { authenticated, user } = await verifyAuth();
```

### logout()
Logout user and clear session
```typescript
await logout();
```

### setupAutoRefresh(minutes)
Setup automatic token refresh
```typescript
const cleanup = setupAutoRefresh(30);
```

---

## Support

For issues or questions:
- Check [API Documentation](./API_DOCUMENTATION.md)
- Review error messages in browser console
- Check network tab for API responses
- Verify backend is running and accessible

---

**Last Updated**: December 2, 2024
**Version**: 1.0.0
