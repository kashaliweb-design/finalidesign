# 51Skills API Documentation

Complete API documentation for the 51Skills authentication system.

## Base URL
```
Backend: https://srv746619.hstgr.cloud/api/v1/auth
Frontend: /api/auth
```

---

## Authentication APIs

### 1. Signup
**Endpoint**: `POST /api/auth/signup`

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "userName": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "123",
      "email": "john@example.com",
      "userName": "johndoe"
    }
  }
}
```

---

### 2. Login
**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "123",
      "email": "john@example.com",
      "userName": "johndoe"
    },
    "token": "jwt_token_here"
  }
}
```

**Cookies Set**: `token` (HTTP-only, 7 days)

---

### 3. Verify Email
**Endpoint**: `POST /api/auth/verify-email`

**Request Body**:
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

### 4. Resend OTP
**Endpoint**: `POST /api/auth/resend-otp`

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "OTP resent successfully"
}
```

**Cooldown**: 60 seconds

---

### 5. Forgot Password
**Endpoint**: `POST /api/auth/forgot-password`

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password reset OTP sent to your email"
}
```

---

### 6. Verify Forgot Password OTP
**Endpoint**: `POST /api/auth/verify-forgot-password`

**Request Body**:
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

---

### 7. Reset Password
**Endpoint**: `POST /api/auth/reset-password`

**Request Body**:
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### 8. Change Password
**Endpoint**: `POST /api/auth/change-password`

**Request Body**:
```json
{
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Headers Required**: `Cookie: token=jwt_token`

**Response**:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 9. Verify Token
**Endpoint**: `GET /api/auth/verify`

**Headers Required**: `Cookie: token=jwt_token`

**Response**:
```json
{
  "success": true,
  "authenticated": true,
  "user": {
    "id": "123",
    "email": "john@example.com",
    "userName": "johndoe"
  }
}
```

---

### 10. Logout
**Endpoint**: `POST /api/auth/logout`

**Headers Required**: `Cookie: token=jwt_token`

**Response**:
```json
{
  "message": "Logged out successfully"
}
```

**Actions**:
- Clears HTTP-only cookies
- Clears localStorage
- Invalidates token on backend

---

### 11. Refresh Token ⭐ NEW
**Endpoint**: `POST /api/auth/refresh-token`

**Headers Required**: `Cookie: token=jwt_token`

**Response**:
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "new_jwt_token_here"
  }
}
```

**Cookies Set**: `token` (HTTP-only, 7 days)

**Auto-Refresh**: Configured to run every 30 minutes on dashboard

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**Common Status Codes**:
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `500` - Internal Server Error

---

## Security Features

### Cookies
- **HTTP-only**: Cannot be accessed via JavaScript
- **Secure**: Only sent over HTTPS in production
- **SameSite**: 'lax' for CSRF protection
- **Path**: '/' for all routes
- **MaxAge**: 7 days (604800 seconds)

### Password Requirements
- Minimum 6 characters
- Must be different from old password (change password)
- Must match confirmation password

### OTP
- 6-digit code
- Sent via email
- 60-second resend cooldown

---

## Usage Examples

### Login Flow
```typescript
const handleLogin = async () => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('userData', JSON.stringify(data.data.user));
    router.push('/dashboard');
  }
};
```

### Protected Route
```typescript
useEffect(() => {
  const checkAuth = async () => {
    const response = await fetch('/api/auth/verify', {
      method: 'GET',
      credentials: 'include'
    });
    
    if (!response.ok) {
      router.push('/auth');
    }
  };
  
  checkAuth();
}, []);
```

### Auto Token Refresh
```typescript
useEffect(() => {
  const interval = setInterval(async () => {
    await fetch('/api/auth/refresh-token', {
      method: 'POST',
      credentials: 'include'
    });
  }, 30 * 60 * 1000); // 30 minutes
  
  return () => clearInterval(interval);
}, []);
```

---

## Utility Functions

Location: `/utils/auth.ts`

### refreshToken()
```typescript
import { refreshToken } from '@/utils/auth';

const result = await refreshToken();
if (result.success) {
  console.log('Token refreshed');
}
```

### verifyAuth()
```typescript
import { verifyAuth } from '@/utils/auth';

const { authenticated, user } = await verifyAuth();
if (authenticated) {
  console.log('User:', user);
}
```

### logout()
```typescript
import { logout } from '@/utils/auth';

await logout();
router.push('/auth');
```

### setupAutoRefresh()
```typescript
import { setupAutoRefresh } from '@/utils/auth';

// Setup auto-refresh every 30 minutes
const cleanup = setupAutoRefresh(30);

// Cleanup on unmount
return () => cleanup();
```

---

## Components

### AuthProvider
Location: `/components/AuthProvider.tsx`

Wraps pages that require authentication and auto-refreshes tokens.

```typescript
import AuthProvider from '@/components/AuthProvider';

export default function ProtectedPage() {
  return (
    <AuthProvider requireAuth={true}>
      <YourContent />
    </AuthProvider>
  );
}
```

---

## Complete Authentication Flow

### Signup → Email Verification → Login
```
1. POST /api/auth/signup
   ↓
2. POST /api/auth/verify-email (with OTP)
   ↓ (optional: POST /api/auth/resend-otp)
3. POST /api/auth/login
   ↓
4. Redirect to /dashboard
```

### Forgot Password → Reset
```
1. POST /api/auth/forgot-password
   ↓
2. POST /api/auth/verify-forgot-password (with OTP)
   ↓ (optional: POST /api/auth/resend-otp)
3. POST /api/auth/reset-password
   ↓
4. Redirect to /auth (login)
```

### Change Password (Authenticated)
```
1. GET /api/auth/verify (check auth)
   ↓
2. POST /api/auth/change-password
   ↓
3. Success message
```

### Session Management
```
Login → Token stored in HTTP-only cookie
   ↓
Every 30 minutes → POST /api/auth/refresh-token
   ↓
On page load → GET /api/auth/verify
   ↓
Logout → POST /api/auth/logout
```

---

## Testing Checklist

- [ ] Signup with valid data
- [ ] Signup with duplicate email
- [ ] Email verification with correct OTP
- [ ] Email verification with wrong OTP
- [ ] Resend OTP (check cooldown)
- [ ] Login with verified account
- [ ] Login with unverified account
- [ ] Forgot password flow
- [ ] Reset password with valid OTP
- [ ] Change password (authenticated)
- [ ] Token verification on protected routes
- [ ] Auto token refresh
- [ ] Logout and cookie clearing
- [ ] Redirect after logout

---

## Notes

- All API routes use `credentials: 'include'` for cookie handling
- Tokens are stored in HTTP-only cookies for security
- User data is stored in localStorage for quick access
- Auto-refresh runs every 30 minutes on dashboard
- All passwords must be at least 6 characters
- OTP resend has 60-second cooldown
- Protected routes redirect to `/auth` if not authenticated

---

**Last Updated**: December 2, 2024
**Version**: 1.0.0
