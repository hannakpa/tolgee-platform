#!/bin/bash

# dar permisos de ejecución: chmod +x run-e2e.sh
# ejecutar el script: ./run-e2e.sh

set -e  # Salir si hay un error

echo "Starting environment for E2E testing..."

# 1. Levantar el frontend
echo "Starting frontend (webapp)..."
cd webapp
VITE_APP_API_URL=http://localhost:8201 npm run start -- --port 8081 --host --no-open &
FRONTEND_PID=$!
cd ..

# 2. Levantar servicios Docker necesarios para E2E
echo "Starting Docker services (fake SMTP, etc)..."
./gradlew runDockerE2eDev &
DOCKER_PID=$!

# 3. Levantar el backend con perfil e2e
echo "Starting Backend with e2e profile..."
./gradlew server-app:bootRun --args='--spring.profiles.active=e2e' &
BACKEND_PID=$!

# 4. Esperar unos segundos a que todo arranque bien
echo "Waiting for complition..."
sleep 10

# 5. Abrir Cypress
echo "Executing Cypress..."
cd e2e
npx cypress open

# 6. Limpiar al cerrar Cypress
echo "Stop and clean all processes..."
kill $FRONTEND_PID $DOCKER_PID $BACKEND_PID || true
