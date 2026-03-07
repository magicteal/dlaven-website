#!/bin/bash

# DLaven Website Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.docker exists
check_env_file() {
    if [ ! -f .env.docker ]; then
        echo -e "${RED}Error: .env.docker file not found!${NC}"
        echo -e "${YELLOW}Please copy .env.docker.example to .env.docker and fill in your credentials:${NC}"
        echo "  cp .env.docker.example .env.docker"
        exit 1
    fi
}

# Help message
show_help() {
    echo "DLaven Website Docker Management"
    echo ""
    echo "Usage: ./docker.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start       - Start all services"
    echo "  stop        - Stop all services"
    echo "  restart     - Restart all services"
    echo "  build       - Build and start services"
    echo "  logs        - Show logs from all services"
    echo "  logs-f      - Follow logs from all services"
    echo "  logs-backend - Show backend logs"
    echo "  logs-frontend - Show frontend logs"
    echo "  status      - Show status of all services"
    echo "  clean       - Stop and remove all containers, networks, and volumes"
    echo "  shell-backend - Open shell in backend container"
    echo "  shell-frontend - Open shell in frontend container"
    echo "  help        - Show this help message"
    echo ""
}

# Start services
start_services() {
    check_env_file
    echo -e "${GREEN}Starting services...${NC}"
    docker-compose --env-file .env.docker up -d
    echo -e "${GREEN}Services started successfully!${NC}"
    echo ""
    show_status
}

# Stop services
stop_services() {
    echo -e "${YELLOW}Stopping services...${NC}"
    docker-compose down
    echo -e "${GREEN}Services stopped successfully!${NC}"
}

# Restart services
restart_services() {
    echo -e "${YELLOW}Restarting services...${NC}"
    docker-compose restart
    echo -e "${GREEN}Services restarted successfully!${NC}"
}

# Build and start services
build_services() {
    check_env_file
    echo -e "${GREEN}Building and starting services...${NC}"
    docker-compose --env-file .env.docker up -d --build
    echo -e "${GREEN}Services built and started successfully!${NC}"
    echo ""
    show_status
}

# Show logs
show_logs() {
    docker-compose logs "$@"
}

# Show status
show_status() {
    echo -e "${GREEN}Service Status:${NC}"
    docker-compose ps
}

# Clean up
clean_up() {
    echo -e "${RED}WARNING: This will remove all containers, networks, and volumes!${NC}"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Cleaning up...${NC}"
        docker-compose down -v
        echo -e "${GREEN}Cleanup completed!${NC}"
    else
        echo -e "${YELLOW}Cleanup cancelled.${NC}"
    fi
}

# Shell commands
backend_shell() {
    docker-compose exec backend sh
}

frontend_shell() {
    docker-compose exec frontend sh
}

# Main command handler
case "$1" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    build)
        build_services
        ;;
    logs)
        show_logs
        ;;
    logs-f)
        show_logs -f
        ;;
    logs-backend)
        show_logs -f backend
        ;;
    logs-frontend)
        show_logs -f frontend
        ;;
    status)
        show_status
        ;;
    clean)
        clean_up
        ;;
    shell-backend)
        backend_shell
        ;;
    shell-frontend)
        frontend_shell
        ;;
    help|--help|-h|"")
        show_help
        ;;
    *)
        echo -e "${RED}Error: Unknown command '$1'${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
