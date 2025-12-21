.PHONY: help install install-backend install-frontend build build-backend build-frontend dev dev-backend dev-frontend test test-backend test-frontend test-coverage lint lint-backend lint-frontend clean clean-backend clean-frontend start start-backend start-frontend

# Default target
help:
	@echo "Available targets:"
	@echo "  install          - Install all dependencies (backend + frontend)"
	@echo "  install-backend  - Install backend dependencies"
	@echo "  install-frontend - Install frontend dependencies"
	@echo "  build            - Build all (backend + frontend)"
	@echo "  build-backend    - Build backend"
	@echo "  build-frontend   - Build frontend"
	@echo "  dev              - Start development servers (backend + frontend)"
	@echo "  dev-backend      - Start backend development server"
	@echo "  dev-frontend     - Start frontend development server"
	@echo "  test             - Run all tests"
	@echo "  test-backend     - Run backend tests"
	@echo "  test-frontend    - Run frontend tests"
	@echo "  test-coverage    - Run tests with coverage report"
	@echo "  lint             - Lint all code"
	@echo "  lint-backend     - Lint backend code"
	@echo "  lint-frontend    - Lint frontend code"
	@echo "  clean            - Clean all build artifacts"
	@echo "  clean-backend    - Clean backend build artifacts"
	@echo "  clean-frontend   - Clean frontend build artifacts"
	@echo "  start            - Start production servers"
	@echo "  start-backend    - Start backend production server"
	@echo "  start-frontend   - Start frontend production server"

# Install dependencies
install: install-backend install-frontend

install-backend:
	cd backend && npm install

install-frontend:
	cd frontend && npm install

# Build
build: build-backend build-frontend

build-backend:
	cd backend && npm run build

build-frontend:
	cd frontend && npm run build

# Development
dev:
	@echo "Starting backend and frontend in development mode..."
	@echo "Backend will run on http://localhost:3000"
	@echo "Frontend will run on http://localhost:5173"
	@make -j2 dev-backend dev-frontend

dev-backend:
	cd backend && npm run dev

dev-frontend:
	cd frontend && npm run dev

# Testing
test: test-backend test-frontend

test-backend:
	cd backend && npm test

test-frontend:
	cd frontend && npm test

test-coverage:
	cd backend && npm run test:coverage
	cd frontend && npm run test:coverage

# Linting
lint: lint-backend lint-frontend

lint-backend:
	cd backend && npm run lint

lint-frontend:
	cd frontend && npm run lint

# Clean
clean: clean-backend clean-frontend

clean-backend:
	cd backend && rm -rf dist node_modules/.cache

clean-frontend:
	cd frontend && rm -rf dist node_modules/.cache

# Production start
start: start-backend start-frontend

start-backend:
	cd backend && npm run build && npm start

start-frontend:
	cd frontend && npm run build && npm run preview
