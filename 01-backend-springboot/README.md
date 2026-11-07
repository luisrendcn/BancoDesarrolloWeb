# GoldenBank Backend

Backend Spring Boot 4 para autenticacion JWT, cuentas y transferencias con MySQL.

## Ejecutar

Requisitos: Java 21, MySQL activo en `localhost:3306` y la base `db_bank`. Inicia primero el microservicio de divisas en `http://localhost:3000` desde `04-servicio-propio-nestjs`.

```powershell
.\mvnw.cmd clean package
java -jar target/bckdbank-0.0.1-SNAPSHOT.jar
```

La configuracion local esta en `src/main/resources/application.yml`. El saldo inicial demo se puede cambiar con `app.account.initial-balance` y por defecto es `1000.00`.

## Swagger / OpenAPI

- Swagger UI: http://localhost:8080/swagger-ui.html
- Especificacion: http://localhost:8080/v3/api-docs

El flujo recomendado es:

1. Ejecutar `POST /api/v1/auth/register` para crear un usuario y su cuenta inicial.
2. Ejecutar `POST /api/v1/auth/login` y copiar `token`.
3. Pulsar `Authorize` en Swagger y pegar el token sin `Bearer`.
4. Ejecutar `GET /api/v1/accounts` y `GET /api/v1/accounts/{accountNumber}`.
5. Registrar un segundo usuario y usar sus cuentas en `POST /api/v1/transactions/transfer`.
6. Confirmar los saldos y ejecutar `GET /api/v1/transactions/account/{accountNumber}`.

Rutas publicas:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

Rutas protegidas:

- `GET /api/v1/accounts`
- `GET /api/v1/accounts/{accountNumber}`
- `POST /api/v1/transactions/transfer`
- `GET /api/v1/transactions/account/{accountNumber}`
- `GET /api/v1/exchange/rate?from=USD&to=COP` (consulta el microservicio NestJS de divisas)

La URL de NestJS se configura con `EXCHANGE_SERVICE_URL` y por defecto es `http://localhost:3000`.
