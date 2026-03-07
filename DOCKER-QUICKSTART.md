# Docker Setup - Quick Start Guide

## ✅ Configuration Complete!

Docker setup MongoDB Atlas ke saath configure ho gaya hai. Local MongoDB container nahi hai - aapka existing Atlas database use hoga.

## 🚀 Application Start Karne Ke Liye:

### Option 1: Script Use Karke (Recommended)
```bash
./docker.sh build
```

### Option 2: Docker Compose Direct
```bash
docker-compose --env-file .env.docker up -d --build
```

## 📍 Application Access:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **Database:** MongoDB Atlas (cloud)

## 🔧 Useful Commands:

```bash
# Services check karne ke liye
./docker.sh status

# Logs dekhne ke liye
./docker.sh logs-f              # All services
./docker.sh logs-backend        # Backend only
./docker.sh logs-frontend       # Frontend only

# Services stop karne ke liye
./docker.sh stop

# Services restart karne ke liye
./docker.sh restart
```

## ⚙️ Configuration Details:

✅ MongoDB Atlas URI configured
✅ Cloudinary settings configured
✅ Razorpay keys configured
✅ JWT secrets set
✅ CORS origins configured

## 📝 Important Notes:

1. **MongoDB Atlas** cloud database use ho rahi hai
2. Local MongoDB container nahi hai
3. MongoDB Atlas me IP whitelist check karein:
   - MongoDB Atlas Dashboard > Network Access
   - 0.0.0.0/0 add karein (testing ke liye)
   
4. Environment variables `.env.docker` me already set hain

## 🐛 Troubleshooting:

Agar connection issue ho:
```bash
# Logs check karein
docker-compose logs backend

# MongoDB Atlas connection verify karein
# - Atlas dashboard me cluster running hai?
# - IP whitelist me apka IP hai?
# - Password special characters URL-encoded hai?
```

## 📚 Detailed Documentation:
Complete guide ke liye [DOCKER.md](DOCKER.md) file dekhen.
