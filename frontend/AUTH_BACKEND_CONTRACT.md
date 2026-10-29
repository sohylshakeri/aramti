# Aramti Auth — Frontend/Backend Contract

The frontend auth UI is complete and calls the Django API through `src/pages/auth/services/authApi.js`.
No provider secret belongs in the frontend repository. Google/Facebook/Apple secrets stay on the backend.

## Base URL

Configured with:

- `VITE_API_BASE_URL` (for example `http://localhost:8000`)
- `VITE_AUTH_BASE_PATH` (default `/api/auth`)

All requests use `credentials: 'include'`. For Django session auth, return/set the session cookie and expose the CSRF cookie as `csrftoken`.

## Expected endpoints

### GET `/me/`
Returns the current authenticated user. A user object should include at least one of `name`, `displayName`, `username`, or `email`.

### POST `/login/`
Request:
```json
{
  "method": "email | username",
  "identifier": "...",
  "password": "...",
  "remember": false
}
```
Response should include the authenticated user, either as the root payload, `{ "user": ... }`, or `{ "data": { "user": ... } }`.

### POST `/signup/`
Request:
```json
{
  "username": "...",
  "email": "...",
  "phone": "...",
  "password": "...",
  "remember": true
}
```
Send a 6-digit verification code to the supplied email. The response may include `verificationId` / `verification_id`.

### POST `/verify-email/`
Request:
```json
{
  "email": "...",
  "code": "123456",
  "verificationId": "optional-backend-id",
  "remember": true
}
```
On success, authenticate the user and return the user object.

### POST `/resend-verification/`
Request:
```json
{
  "email": "...",
  "verificationId": "optional-backend-id"
}
```
The frontend shows a 120-second countdown and replaces it with `Resend Code` when it reaches zero.

### POST `/forgot-password/`
Request:
```json
{ "email": "..." }
```
Send the password-reset email. The frontend intentionally displays a neutral success message to avoid account enumeration.

### POST `/logout/`
Destroy the server session/token cookie.

### GET `/oauth/<provider>/`
Providers used by the UI: `google`, `facebook`, `apple`.
The frontend sends a `return_to` query parameter pointing to `/auth/callback`. Complete OAuth on the backend, establish the session, then redirect to that callback. The callback calls `/me/` and returns the user to the stored frontend route.

## Remember me

The UI sends `remember` during sign-up/login. The backend should choose the appropriate session expiry. The frontend also mirrors the user in `localStorage` for remembered sessions and `sessionStorage` otherwise, but the backend session remains authoritative.
