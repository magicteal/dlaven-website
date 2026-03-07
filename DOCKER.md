# Docker Setup Guide for DLaven Website

This guide explains how to run the DLaven website using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10 or higher
- Docker Compose 2.0 or higher
- MongoDB Atlas account (cloud database)

## Quick Start

1. **Configure Environment Variables**
   
   The `.env.docker` file is already created with your MongoDB Atlas connection. Review and update if needed:
   ```bash
   nano .env.docker  # or use your preferred editor
   ```
   
   Ensure these are set correctly:
   - MongoDB Atlas URI
   - JWT secrets
   - Cloudinary credentials
   - Email/SMTP configuration (optional)
   - Razorpay credentials

2. **Build and Start Services**
   
   ```bash
   docker-compose --env-file .env.docker up -d --build
   ```

3. **Access the Application**
   
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## Docker Commands

### Start Services
```bash
# Start all services in detached mode
docker-compose --env-file .env.docker up -d

# Start with build (after code changes)
docker-compose --env-file .env.docker up -d --build

# Start specific service
docker-compose --env-file .env.docker up -d backend
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database data)
docker-compose down -v
```

### View Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Check Service Status
```bash
# List running containers
docker-compose ps

# Check health status
docker-compose ps
```

### Execute Commands in Containers
```bash
# Access backend shell
docker-compose exec backend sh

# Access frontend shell
docker-compose exec frontend sh
```

## Architecture

The Docker setup includes two services:

1. **Backend** (Port 4000)
   - Node.js/TypeScript Express API
   - Multi-stage build for optimized image size
   - Runs as non-root user for security
   - Connects to MongoDB Atlas (cloud database)

2. **Frontend** (Port 3000)
   - Next.js application
   - Standalone output mode for optimal performance
   - Runs as non-root user for security
   - Depends on backend

All services communicate through the `dlaven-network` bridge network.

**Database:** MongoDB Atlas is used as the cloud database solution. No local MongoDB container is needed.

## Development vs Production

### Development
For local development without Docker, continue using:
```bash
# Backend
cd Backend
npm install
npm run dev

# Frontend
cd Frontend
npm install
npm run dev
```

### Production
For production deployment with Docker:
```bash
docker-compose --env-file .env.docker up -d --build
```

## Environment Variables

### Required Backend Variables
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret for JWT token generation
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `FRONTEND_ORIGIN` - Allowed CORS origins

### Optional Backend Variables
- `CLOUDINARY_CLOUD_NAME` - For image uploads
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `SMTP_HOST` - Email server host
- `SMTP_PORT` - Email server port
- `SMTP_USER` - Email username
- `SMTP_PASSWORD` - Email password
- `SMTP_FROM_EMAIL` - From email address
- `RAZORPAY_KEY_ID` - Payment gateway key
- `RAZORPAY_KEY_SECRET` - Payment gateway secret

### Required Frontend Variables
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Troubleshooting

### Services Won't Start
```bash
# Check logs for errors
docker-compose logs

# Rebuild from scratch
docker-compose down -v
docker-compose --env-file .env.docker up -d --build
```

### Database Connection Issues
```bash
# Verify backend is running and can connect to Atlas
docker-compose logs backend

# Check if MongoDB Atlas connection is working
docker-compose exec backend sh
# Inside container, you can test connection
```

Make sure:
- Your MongoDB Atlas cluster is running
- IP whitelist in Atlas allows connections (add 0.0.0.0/0 for testing)
- Connection string password is URL-encoded if it contains special characters

### Frontend Can't Connect to Backend
- Ensure `NEXT_PUBLIC_API_URL` is set correctly
- Check if backend service is healthy: `docker-compose ps backend`
- Verify CORS settings in backend allow the frontend origin

### Port Conflicts
If ports 3000 or 4000 are already in use:

Edit `docker-compose.yml` and change port mappings:
```yaml
ports:
  - "3001:3000"  # Change external port
```

## Data Persistence

Database data is stored in **MongoDB Atlas** (cloud). No local volumes are used for database storage.

To backup your MongoDB Atlas database, use MongoDB Atlas built-in backup features or use `mongodump`:

```bash
# Backup from Atlas
mongodump --uri="your_atlas_connection_string" --out=./backup

# Restore to Atlas
mongorestore --uri="your_atlas_connection_string" ./backup
```

## Security Notes

- Change default MongoDB credentials in `.env.docker`
- Use strong JWT secrets (at least 32 characters)
- Use strong JWT secrets (at least 32 characters)
- MongoDB Atlas provides built-in security (encryption, authentication, IP whitelisting)
- Never commit `.env.docker` to version control
- Services run as non-root users inside containers
- Enable TLS/SSL for production deployments
- Configure MongoDB Atlas IP Access List for production

The Docker images use:
- Multi-stage builds to minimize image size
- Node.js Alpine base images (smaller footprint)
- Production dependencies only in final images
- Health checks for service availability
- Proper layer caching for faster rebuilds

## Cleaning Up

Remove all containers, networks, and volumes:
```bash
# Stop and remove containers
docker-compose down

# Remove images
docker rmi dlaven-website-frontend dlaven-website-backend

# Remove all unused Docker resources
docker system prune -a --volumes
```

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- Verify health: `docker-compose ps`
- Review environment variables in `.env.docker`
