# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common Commands

### Development
- **Start development server**: `npm run dev` - Uses Node's `--watch` flag for auto-restart
- **Build/Production**: No build step required (pure Node.js/ES modules)

### Code Quality
- **Lint code**: `npm run lint` - ESLint with recommended config
- **Fix linting issues**: `npm run lint:fix`
- **Format code**: `npm run format` - Prettier formatting
- **Check formatting**: `npm run format:check`

### Database Operations
- **Generate migrations**: `npm run db:generate` - Drizzle ORM schema generation
- **Run migrations**: `npm run db:migrate` - Apply pending migrations
- **Database studio**: `npm run db:studio` - Drizzle Studio for database management

## Project Architecture

### Tech Stack
- **Runtime**: Node.js with ES modules (`"type": "module"`)
- **Framework**: Express.js 5.x with modern middleware
- **Database**: PostgreSQL via Neon serverless with Drizzle ORM
- **Authentication**: JWT with httpOnly cookies
- **Validation**: Zod schemas
- **Logging**: Winston with structured logging

### Directory Structure & Path Mapping
The project uses Node.js subpath imports for clean internal module resolution:
- `#config/*` → `./src/config/*`
- `#controllers/*` → `./src/controllers/*` 
- `#middleware/*` → `./src/middleware/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#services/*` → `./src/services/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`

### Application Flow
1. **Entry Point**: `src/index.js` → loads environment → starts `src/server.js`
2. **App Configuration**: `src/app.js` configures Express with security middleware (helmet, cors, morgan)
3. **Database**: Neon PostgreSQL with Drizzle ORM, connection configured in `src/config/database.js`
4. **Logging**: Winston logger with file and console transports, different formats for dev/prod

### Authentication Architecture
- **JWT Strategy**: Tokens stored in httpOnly cookies for security
- **Password Handling**: bcrypt hashing with salt rounds of 10
- **User Model**: Simple schema with id, name, email, password, role, timestamps
- **Validation**: Zod schemas ensure data integrity before database operations
- **Token Expiry**: 1 day default, configurable via JWT_EXPIRES_IN

### Key Patterns
- **Service Layer**: Business logic separated into services (e.g., `auth.service.js`)
- **Controller Pattern**: Request/response handling with proper error boundaries
- **Validation First**: All inputs validated with Zod schemas before processing
- **Error Handling**: Centralized logging with Winston, structured error responses
- **Database Queries**: Drizzle ORM with type-safe operations and SQL-like syntax

## Environment Variables
Required environment variables (create `.env` file):
- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret (change in production)
- `PORT` - Server port (defaults to 3000)
- `NODE_ENV` - Environment (affects logging and cookie security)
- `LOG_LEVEL` - Winston logging level (defaults to 'info')

## Development Notes
- **Hot Reloading**: Built-in via `node --watch` in dev command
- **Database Schema**: Uses Drizzle migrations stored in `/drizzle` directory
- **Code Style**: ESLint with single quotes, 2-space indentation, unix line endings
- **Import Style**: Use hash-prefixed imports (`#config/logger.js`) for internal modules
- **Error Handling**: Controllers should use try/catch with proper logging and next(err) for unhandled cases
- **Cookie Security**: Automatically secure in production, httpOnly, sameSite strict