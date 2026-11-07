# GoldenBank

Aplicacion bancaria con una interfaz React, una API Spring Boot, MySQL y un microservicio NestJS para consultar tasas de cambio.

## Ejecutar con Docker

1. Copia `.env.docker.example` a `.env` y define contrasenas y un secreto JWT propios.
2. Desde la raiz, inicia los servicios:

   ```powershell
   docker compose up --build -d
   ```

3. Abre http://localhost:5173.

Consulta [DOCKER.md](./DOCKER.md) para requisitos y comandos adicionales. El archivo `.env` contiene credenciales locales y no debe publicarse ni compartirse.

## Estructura

- `01-backend-springboot/`: API de autenticacion, cuentas, transacciones y tasas de cambio.
- `goldenbank-frontend/`: interfaz React, TypeScript y Vite.
- `04-servicio-propio-nestjs/`: adaptador de tasas de cambio de Frankfurter.
- `docker-compose.yml`: servicios y red local de la aplicacion.

## Desarrollo local

Consulta los README de [Spring Boot](./01-backend-springboot/README.md), [frontend](./goldenbank-frontend/README.md) y [NestJS](./04-servicio-propio-nestjs/README.md) para iniciar cada componente por separado.
