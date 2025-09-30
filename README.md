# 🏢 Acquisitions - Dockerized Node.js Application

A modern Node.js application built with Express, Drizzle ORM, and Neon Database, fully dockerized for both development and production environments.

## 🚀 Quick Start

### For Development (with Neon Local)
```powershell
# 1. Clone and navigate to the project
git clone <your-repo-url>
cd acquisitions

# 2. Set up your environment (see Configuration section below)
# Edit .env.development with your Neon credentials

# 3. Start development environment
.\start-dev.ps1
# OR
docker-compose -f docker-compose.dev.yml up --build

# 4. Access your application
# http://localhost:3000
```

### For Production
```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🏗️ Architecture

### Development Environment
- **🐳 Application Container**: Hot-reload enabled Node.js app
- **🗄️ Neon Local**: Ephemeral database branches for clean testing
- **🔗 Connection**: Standard PostgreSQL driver with SSL support

### Production Environment
- **🐳 Application Container**: Optimized, security-hardened build
- **☁️ Neon Cloud**: Direct connection to production database
- **⚡ Connection**: Neon serverless driver for optimal performance

## 📋 Prerequisites

- **Docker Desktop** (Windows/Mac) or Docker Engine (Linux)
- **Docker Compose** v3.8+
- **Neon Account** with a project created
- **Node.js 20+** (optional, for local development)

## 🔧 Configuration

### 1. Neon Setup

1. Create a Neon account at [console.neon.tech](https://console.neon.tech)
2. Create a new project
3. Get your credentials:
   - API Key (from Account Settings)
   - Project ID (from project dashboard)
   - Parent Branch ID (usually `main` branch)

### 2. Environment Files

#### Development Configuration (`.env.development`)
```bash
# Server Configuration
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# Database Configuration - Neon Local
DATABASE_URL=postgres://neon:npg@neon-local:5432/neondb?sslmode=require

# Neon Local Configuration
NEON_API_KEY=your_neon_api_key_here
NEON_PROJECT_ID=your_neon_project_id_here
PARENT_BRANCH_ID=your_parent_branch_id_here

# Arcjet
ARCJET_KEY=your_arcjet_key_here
```

#### Production Configuration (`.env.production`)
```bash
# Server Configuration
PORT=3000
NODE_ENV=production
LOG_LEVEL=info

# Database Configuration - Neon Cloud
DATABASE_URL=${DATABASE_URL}
ARCJET_KEY=${ARCJET_KEY}
```

## 🐳 Docker Setup

### File Structure
```
acquisitions/
├── Dockerfile              # Multi-stage build configuration
├── docker-compose.dev.yml  # Development with Neon Local
├── docker-compose.prod.yml # Production configuration
├── .dockerignore           # Build optimization
├── start-dev.ps1           # Windows development script
├── .env.development        # Development environment
├── .env.production         # Production environment template
└── DOCKER_README.md        # Detailed Docker documentation
```

### Development Commands

```powershell
# Quick start (Windows)
.\start-dev.ps1

# Manual start
docker-compose -f docker-compose.dev.yml up --build

# Background mode
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down

# Access application shell
docker-compose -f docker-compose.dev.yml exec app sh

# Run database migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate
```

### Production Commands

```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up --build -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

## 🗄️ Database Management

### Development (Ephemeral Branches)
- **Automatic**: New branch created on container start
- **Clean State**: Fresh database every time
- **No Cleanup**: Branch deleted when container stops

### Database Commands
```bash
# Generate migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:generate

# Run migrations  
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Open Drizzle Studio
docker-compose -f docker-compose.dev.yml exec app npm run db:studio
```

## 🔍 Health Checks & Monitoring

### Endpoints
- **Application Health**: `http://localhost:3000/health`
- **API Status**: `http://localhost:3000/api`
- **Main Route**: `http://localhost:3000/`

### Health Check Response
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## 🚀 Deployment

### Railway
```bash
# Set environment variables in Railway dashboard:
DATABASE_URL=your_neon_production_url
ARCJET_KEY=your_production_key

# Deploy
railway up
```

### Render
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Use `Dockerfile` or `docker-compose.prod.yml`

### AWS/Azure/GCP
```bash
# Build and push image
docker build --target production -t your-registry/acquisitions:latest .
docker push your-registry/acquisitions:latest

# Deploy using your platform's container service
```

## 🛠️ Development Workflow

### 1. Start Development Environment
```powershell
.\start-dev.ps1
```

### 2. Make Changes
- Code changes trigger automatic reload
- Database changes persist within session
- Fresh branch created on each restart

### 3. Database Changes
```bash
# 1. Update schema files in src/models/
# 2. Generate migration
docker-compose -f docker-compose.dev.yml exec app npm run db:generate
# 3. Apply migration
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate
```

### 4. Testing
```bash
# Run tests (add your test command)
docker-compose -f docker-compose.dev.yml exec app npm test

# Check application health
curl http://localhost:3000/health
```

## 🔧 Troubleshooting

### Common Issues

#### Docker Not Running
```
❌ Docker is not running. Please start Docker Desktop and try again.
```
**Solution**: Start Docker Desktop and wait for it to be fully running.

#### Port Already in Use
```
Error: bind: address already in use
```
**Solution**: Stop other services using ports 3000 or 5432, or modify port mapping in docker-compose files.

#### Neon Local Connection Issues
```bash
# Check Neon Local logs
docker-compose -f docker-compose.dev.yml logs neon-local

# Verify environment variables
docker-compose -f docker-compose.dev.yml exec neon-local env | grep NEON
```

#### SSL Certificate Issues
The application automatically handles Neon Local's self-signed certificates. If you encounter SSL errors, ensure:
- Database config includes `rejectUnauthorized: false`
- Connection string has `sslmode=require`

### Log Locations
```bash
# Application logs
docker-compose -f docker-compose.dev.yml logs app

# Database proxy logs  
docker-compose -f docker-compose.dev.yml logs neon-local

# All services
docker-compose -f docker-compose.dev.yml logs -f
```

## 📚 Technology Stack

- **Runtime**: Node.js 20 (Alpine Linux)
- **Framework**: Express.js 5
- **Database**: Neon (PostgreSQL)
- **ORM**: Drizzle ORM
- **Security**: Helmet, Arcjet
- **Logging**: Winston, Morgan
- **Validation**: Zod
- **Containerization**: Docker, Docker Compose

## 📖 Additional Documentation

- [**DOCKER_README.md**](DOCKER_README.md) - Comprehensive Docker setup guide
- [**Neon Local Documentation**](https://neon.com/docs/local/neon-local) - Official Neon Local docs
- [**Drizzle ORM**](https://orm.drizzle.team/) - ORM documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Start development environment: `.\start-dev.ps1`
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

---

**Need Help?** 
- Check the [troubleshooting section](#-troubleshooting) above
- Review Docker logs: `docker-compose -f docker-compose.dev.yml logs`
- Open an issue with detailed error messages