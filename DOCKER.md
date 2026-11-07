# Dockerizar GoldenBank localmente

## Requisitos

- Docker Desktop iniciado con Docker Compose v2.
- Un archivo `.env` en la raíz. Copia `.env.docker.example` a `.env` y define valores propios para `MYSQL_ROOT_PASSWORD` y `APP_JWT_SECRET` (el secreto JWT debe tener al menos 32 caracteres).

## Arrancar todos los servicios

Desde la raíz del repositorio, en PowerShell:

```powershell
Copy-Item .env.docker.example .env
notepad .env
# Edita las dos claves indicadas y guarda el archivo.
docker compose config --quiet
docker compose up --build -d
docker compose ps
```

Abre http://localhost:5173. La primera compilación descarga las imágenes base y puede tardar. El frontend se sirve con Nginx; sus rutas `/api` y `/finnhub` se envían al backend Spring Boot. Spring se conecta al servicio `mysql` en la red privada de Compose. El microservicio NestJS se comunica con Frankfurter.

## Comandos útiles

```powershell
docker compose logs -f
docker compose logs -f backend
docker compose restart backend
docker compose down
```

`docker compose down` conserva el volumen MySQL. Para borrar también todos los datos persistidos (acción destructiva): `docker compose down -v`.

## Componentes

- Frontend React/Vite: `goldenbank-frontend/Dockerfile`; build multi-stage y Nginx para servir SPA y proxy.
- Backend Spring Boot: `01-backend-springboot/Dockerfile`; build Maven/Java 21 multi-stage.
- Servicio NestJS: `04-servicio-propio-nestjs/Dockerfile`; build TypeScript y runtime Node.
- MySQL: imagen oficial MySQL 8.4, con volumen persistente `mysql_data`.
- `docker-compose.yml`: crea la red privada, espera a que MySQL esté saludable antes de arrancar Spring y enlaza servicios por sus nombres DNS internos.

Los `.dockerignore` excluyen dependencias, compilados, secretos y archivos Git de los contextos enviados al daemon. No guardar secretos en la imagen ni en el repositorio; `.env` está ignorado por Git.
