# Acquisitions App - Docker Setup Guide

This guide explains how to dockerize your Acquisitions application with support for both development (using Neon Local) and production (using Neon Cloud) environments.

## 🏗️ Architecture Overview

### Development Environment
- **Application**: Runs in Docker with hot reload
- **Database**: Neon Local proxy creating ephemeral branches
- **Driver**: Standard PostgreSQL driver for local connections

### Production Environment  
- **Application**: Optimized Docker build with security hardening
- **Database**: Direct connection to Neon Cloud
- **Driver**: Neon serverless driver for optimal performance

## 📋 Prerequisites

- Docker and Docker Compose installed
- Neon account with a project set up
- Node.js 20+ (for local development without Docker)

## 🔧 Environment Setup

### 1. Get Your Neon Credentials

First, obtain your Neon credentials from the [Neon Console](https://console.neon.tech):

```bash
NEON_API_KEY=your_neon_api_key_here
NEON_PROJECT_ID=your_neon_project_id_here  
PARENT_BRANCH_ID=your_parent_branch_id_here
```

### 2. Configure Environment Files

#### Development Configuration
Update `.env.development` with your Neon credentials:

```bash
# Neon Local Configuration
NEON_API_KEY=your_actual_neon_api_key
NEON_PROJECT_ID=your_actual_neon_project_id  
PARENT_BRANCH_ID=your_actual_parent_branch_id

# Keep existing Arcjet key
ARCJET_KEY=your_existing_arcjet_key
```

#### Production Configuration
Update `.env.production` or set environment variables in your deployment platform:

```bash
DATABASE_URL=postgresql://neondb_owner:npg_xxxxx@ep-xxxxx-pooler.region.aws.neon.tech/neondb?sslmode=require&channel_binding=require
ARCJET_KEY=your_production_arcjet_key
```

## 🚀 Development Deployment

### Quick Start
```bash
# Start development environment with Neon Local
docker-compose -f docker-compose.dev.yml up --build

# Access your application
curl http://localhost:3000/health
```

### What Happens in Development Mode

1. **Neon Local Container**: 
   - Starts the Neon Local proxy service
   - Creates an ephemeral database branch from your parent branch
   - Provides a local PostgreSQL endpoint at `neon-local:5432`

2. **Application Container**:
   - Builds using the `development` target in Dockerfile
   - Connects to Neon Local using standard PostgreSQL driver
   - Enables hot reload with mounted source code
   - Waits for Neon Local to be healthy before starting

### Development Commands

```bash
# Start services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services (this deletes the ephemeral branch)
docker-compose -f docker-compose.dev.yml down

# Rebuild and restart
docker-compose -f docker-compose.dev.yml up --build --force-recreate

# Access application shell
docker-compose -f docker-compose.dev.yml exec app sh

# Run database migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Access Drizzle Studio
docker-compose -f docker-compose.dev.yml exec app npm run db:studio
```

## 🌐 Production Deployment

### Docker Compose Production

```bash
# Build and start production services
docker-compose -f docker-compose.prod.yml up --build -d

# Check application health
curl http://localhost:3000/health
```

### Environment Variables for Production

Set these in your deployment platform (Railway, Render, AWS, etc.):

```bash
DATABASE_URL=your_neon_cloud_connection_string
ARCJET_KEY=your_production_arcjet_key
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
```

### Production Features

- **Optimized Build**: Multi-stage build with production dependencies only
- **Security**: Non-root user, security options, resource limits
- **Health Checks**: Built-in application health monitoring
- **Logging**: Structured logging with rotation
- **Automatic Restarts**: Unless explicitly stopped

## 🛠️ Manual Docker Commands

### Build Images
```bash
# Development image
docker build --target development -t acquisitions:dev .

# Production image  
docker build --target production -t acquisitions:prod .
```

### Run Containers
```bash
# Development with Neon Local
docker run -d --name neon-local \
  -p 5432:5432 \
  -e NEON_API_KEY=your_key \
  -e NEON_PROJECT_ID=your_project \
  -e PARENT_BRANCH_ID=your_branch \
  neondatabase/neon_local:latest

docker run -d --name acquisitions-dev \
  -p 3000:3000 \
  --env-file .env.development \
  --link neon-local \
  acquisitions:dev

# Production  
docker run -d --name acquisitions-prod \
  -p 3000:3000 \
  -e DATABASE_URL=your_neon_cloud_url \
  -e ARCJET_KEY=your_key \
  acquisitions:prod
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Neon Local Connection Issues
```bash
# Check Neon Local logs
docker-compose -f docker-compose.dev.yml logs neon-local

# Verify environment variables are set
docker-compose -f docker-compose.dev.yml exec neon-local env | grep NEON
```

#### 2. SSL/TLS Issues with Neon Local
The application handles self-signed certificates automatically. If you see SSL errors, ensure:
- `rejectUnauthorized: false` is set in database config
- Connection string includes `sslmode=require`

#### 3. Database Migration Issues
```bash
# Run migrations manually
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Check database connection
docker-compose -f docker-compose.dev.yml exec app node -e "
const { db } = require('./src/config/database.js');
console.log('Database connected successfully');
"
```

#### 4. Port Conflicts
If port 3000 or 5432 are already in use:
```bash
# Change ports in docker-compose.yml
# For app: "3001:3000"
# For neon-local: "5433:5432"
```

### Health Check Endpoints

- Application: `http://localhost:3000/health`
- API Status: `http://localhost:3000/api`

### Viewing Logs

```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Specific service
docker-compose -f docker-compose.dev.yml logs -f app
docker-compose -f docker-compose.dev.yml logs -f neon-local

# Production logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 🔄 Environment Switching

The application automatically detects the environment and configures the database driver accordingly:

- **Development + Neon Local**: Uses PostgreSQL driver with SSL configuration for self-signed certificates
- **Production + Neon Cloud**: Uses Neon serverless driver for optimal performance

## 📦 Deployment Platforms

### Railway
```bash
# Set environment variables in Railway dashboard
DATABASE_URL=your_neon_connection_string
ARCJET_KEY=your_arcjet_key

# Deploy with Dockerfile
railway up
```

### Render
```bash
# Use docker-compose.prod.yml or Dockerfile
# Set environment variables in Render dashboard
```

### AWS/Digital Ocean
```bash
# Use docker-compose.prod.yml
# Or build and push to container registry
docker build --target production -t your-registry/acquisitions:latest .
docker push your-registry/acquisitions:latest
```

## 🧹 Cleanup

```bash
# Stop and remove development containers
docker-compose -f docker-compose.dev.yml down -v

# Stop and remove production containers  
docker-compose -f docker-compose.prod.yml down -v

# Remove all unused Docker resources
docker system prune -a
```

## 📚 Additional Resources

- [Neon Local Documentation](https://neon.com/docs/local/neon-local)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Docker Compose Reference](https://docs.docker.com/compose/)

---

**Need Help?** Check the troubleshooting section above or review the Docker and application logs for specific error messages.