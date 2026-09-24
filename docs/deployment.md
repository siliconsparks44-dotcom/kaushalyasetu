# Deployment Guide

## 1. Local Development
```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```
Visit http://localhost:3000

## 2. Docker Deployment
```bash
docker-compose up --build -d
```

## 3. Production Environment Variables
Configure the following in `.env`:
- `DATABASE_URL`: SQLite `file:./dev.db` or PostgreSQL connection string
- `AUTH_SECRET`: Random 32+ character string
- `AI_PROVIDER`: `local` or `gemini`
- `AI_API_KEY`: API key if using cloud AI provider
- `PORT`: 3000
