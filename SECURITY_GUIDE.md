# Security Guide: Protecting Your API Keys

## ⚠️ Critical Security Rule

**NEVER expose your GLM API key in frontend code!** The API key should ONLY exist in the backend.

## Current Architecture (Secure)

```
Frontend (React) → Backend (FastAPI) → GLM API
     No API key       Has API key       Uses API key
```

Your API key is safely stored in `backend/.env` and never leaves the backend server.

## React 18 SSR Options for Enhanced Security

### Option 1: Keep Current Architecture (Recommended)
Your current setup is already secure:
- Frontend makes requests to YOUR backend at `http://localhost:8000`
- Backend holds the API key and makes requests to GLM
- API key never exposed to browser

### Option 2: Next.js with SSR (More Complex)
If you want Server-Side Rendering for additional benefits:

```bash
# Convert to Next.js
npx create-next-app@latest aiux-next --typescript --tailwind
```

Benefits:
- API routes run on server (API key stays server-side)
- Better SEO and initial page load
- Built-in API route protection

Example Next.js API route:
```javascript
// pages/api/generate/context.js
export default async function handler(req, res) {
  const response = await fetch('https://api.z.ai/...', {
    headers: {
      'Authorization': `Bearer ${process.env.GLM_API_KEY}`
    }
  });
  // API key never sent to client
}
```

### Option 3: Remix (Full-Stack React)
Another SSR option with built-in security:

```javascript
// app/routes/api.generate.tsx
export const action = async ({ request }) => {
  // Server-only code - API key safe here
  const glmResponse = await callGLM(process.env.GLM_API_KEY);
  return json(glmResponse);
};
```

## Security Checklist

### ✅ DO:
- [x] Store API key in `backend/.env`
- [x] Use backend as proxy to GLM API
- [x] Validate all user input in backend
- [x] Use HTTPS in production
- [x] Implement rate limiting
- [x] Add CORS restrictions
- [ ] Add authentication if needed
- [ ] Monitor API usage

### ❌ DON'T:
- Never put API key in React component
- Never send API key to frontend
- Never commit .env files to git
- Never expose backend directly to internet without protection
- Never trust frontend validation alone

## Environment Variables Security

### Development (.env)
```env
# backend/.env (NEVER commit this)
GLM_API_KEY=your-actual-key-here
```

### Frontend (.env)
```env
# .env (Safe to commit - no secrets)
VITE_API_URL=http://localhost:8000
```

### Production
Use environment variables from your hosting provider:
- Vercel: Environment Variables in dashboard
- Heroku: Config Vars
- AWS: Secrets Manager
- Docker: Docker Secrets

## Testing Security

### 1. Check for API Key Exposure
```bash
# Search for API key in frontend build
npm run build
grep -r "GLM_API_KEY" dist/
# Should return nothing
```

### 2. Check Network Tab
1. Open browser DevTools
2. Go to Network tab
3. Use the app
4. Check all requests - API key should NEVER appear

### 3. Test Backend Security
```bash
# This should fail (no API key in header)
curl http://localhost:8000/generate/context-questions \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"text": "test"}'
```

## Rate Limiting Implementation

Add to your backend:
```python
from fastapi import HTTPException
from collections import defaultdict
from datetime import datetime, timedelta

class RateLimiter:
    def __init__(self, requests_per_minute=10):
        self.requests = defaultdict(list)
        self.limit = requests_per_minute

    def check_rate_limit(self, client_ip: str):
        now = datetime.now()
        minute_ago = now - timedelta(minutes=1)

        # Clean old requests
        self.requests[client_ip] = [
            req_time for req_time in self.requests[client_ip]
            if req_time > minute_ago
        ]

        if len(self.requests[client_ip]) >= self.limit:
            raise HTTPException(429, "Rate limit exceeded")

        self.requests[client_ip].append(now)

rate_limiter = RateLimiter()

# Use in endpoints:
@app.post("/generate/context-questions")
async def generate_context_questions(request: Request, ...):
    rate_limiter.check_rate_limit(request.client.host)
    # ... rest of endpoint
```

## Authentication (If Needed)

If you want user-specific access:

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

# Protected endpoint
@app.post("/generate/context-questions")
async def generate_context_questions(
    request: ProblemDescription,
    user = Depends(verify_token)
):
    # Now you know which user is making the request
    pass
```

## Monitoring & Alerts

### Track API Usage
```python
import logging

# Log every API call
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time

    logger.info(f"{request.client.host} - {request.method} {request.url.path} - {process_time:.3f}s")

    return response
```

### Cost Monitoring
```python
# Track token usage
class UsageTracker:
    def __init__(self):
        self.total_tokens = 0
        self.total_cost = 0

    def track(self, tokens: int, model: str):
        self.total_tokens += tokens
        # GLM-4.5 pricing (example)
        if model == "glm-4.5":
            self.total_cost += (tokens / 1000) * 0.001  # $0.001 per 1K tokens
```

## Deployment Security

### Docker Deployment
```dockerfile
# Dockerfile
FROM python:3.10-slim

# Don't copy .env file
COPY requirements.txt app.py ./

# Use runtime environment variables
ENV GLM_API_KEY=${GLM_API_KEY}

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/m;

    location /api/ {
        limit_req zone=api burst=5;
        proxy_pass http://localhost:8000/;

        # Security headers
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options DENY;
        add_header X-XSS-Protection "1; mode=block";
    }
}
```

## Emergency Response

If API key is exposed:
1. **Immediately regenerate** key at https://open.bigmodel.cn/
2. **Update** backend/.env with new key
3. **Check logs** for unauthorized usage
4. **Audit** codebase for exposure points
5. **Review** git history - use BFG Repo-Cleaner if needed

## Summary

Your current architecture is secure:
- ✅ API key only in backend
- ✅ Frontend talks to your backend
- ✅ Backend talks to GLM API
- ✅ No API key exposure risk

For production, add:
- Rate limiting
- HTTPS
- Authentication (if multi-user)
- Monitoring
- Proper deployment secrets management