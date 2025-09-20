# OTP-based Citizen Authentication (NYAY-setu)

Overview
- Endpoints:
  - POST /api/auth/register { phone?, email?, name? } — generates OTP and upserts Citizen
  - POST /api/auth/verify { phone? | email?, otp } — verifies OTP, returns JWT

Required environment variables
- DATABASE_URL — Postgres connection string used by Prisma
- JWT_SECRET — HMAC secret for signing JWTs (set to a secure value in production)
- (Optional) TWILIO_* or MSG91_* if integrating real SMS provider later

Dependencies to install
- npm install jsonwebtoken
- prisma client generated via: npx prisma generate

Local setup & migration
1. Ensure DATABASE_URL is set.
2. npx prisma generate
3. npx prisma migrate dev --name add_citizen_models
4. (Optional) ts-node scripts/seed-citizen.ts

Testing
- Request OTP (logs OTP to server using stub):
  curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"phone":"9999999999","name":"Test"}'

- Verify OTP:
  curl -X POST http://localhost:3000/api/auth/verify -H "Content-Type: application/json" -d '{"phone":"9999999999","otp":"<OTP_FROM_LOG>"}'

After successful verification you will receive:
{ "ok": true, "token": "<JWT>" }

Use: Authorization: Bearer <JWT>