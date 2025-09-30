# 🚀 Quick Reference - Acquisitions Docker Setup

## ⚡ Quick Commands

### Development
```powershell
# Start everything
.\start-dev.ps1

# Manual start
docker-compose -f docker-compose.dev.yml up --build -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop everything
docker-compose -f docker-compose.dev.yml down
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up --build -d
docker-compose -f docker-compose.prod.yml logs -f
docker-compose -f docker-compose.prod.yml down
```

## 🌐 Access Points

- **Application**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **API**: http://localhost:3000/api

## 🗄️ Database Commands

```bash
# Generate migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:generate

# Run migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Drizzle Studio
docker-compose -f docker-compose.dev.yml exec app npm run db:studio
```

## 🔧 Debugging

```bash
# Access container shell
docker-compose -f docker-compose.dev.yml exec app sh

# Check Neon Local
docker-compose -f docker-compose.dev.yml logs neon-local

# Environment check
docker-compose -f docker-compose.dev.yml exec app env | grep DATABASE
```

## ⚙️ Environment Variables (Development)

```bash
NEON_API_KEY=your_neon_api_key
NEON_PROJECT_ID=your_project_id  
PARENT_BRANCH_ID=your_branch_id
ARCJET_KEY=your_arcjet_key
```

## 🛑 Emergency Commands

```bash
# Kill everything
docker-compose -f docker-compose.dev.yml down -v
docker system prune -a

# Rebuild from scratch
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up --force-recreate
```