# GoldenBank Frontend

Interfaz bancaria construida con React 19, TypeScript y Vite 8. Incluye acceso y registro, resumen financiero, cuentas, movimientos, cotizaciones de mercado y un conversor de divisas conectado al backend Spring Boot y al microservicio NestJS.

## Desarrollo local

Requiere Node.js 22.12 o superior.

1. Inicia el microservicio de divisas desde `04-servicio-propio-nestjs`:

   ```powershell
   npm install
   npm run start:dev
   ```

2. Inicia Spring Boot desde `01-backend-springboot`:

   ```powershell
   .\mvnw.cmd spring-boot:run
   ```

3. Inicia el frontend desde `goldenbank-frontend`:

   ```powershell
   npm install
   npm run dev
   ```

Abre http://localhost:5173. La configuracion local de Vite utiliza `VITE_BACKEND_URL` para conectarse con Spring Boot.

## Integracion de divisas

La pagina **Divisas** solicita a Spring Boot una tasa de referencia autenticada (`GET /api/v1/exchange/rate?from=USD&to=COP`). Spring Boot consulta el microservicio NestJS mediante `EXCHANGE_SERVICE_URL`, y NestJS adapta la respuesta de Frankfurter. Frankfurter no necesita una clave API; las tasas son referencias diarias.

## Scripts

```powershell
npm run dev
npm run build
npm run lint
```
