# Microservicio de divisas (NestJS)

Servicio independiente que integra las cotizaciones de divisas de [Frankfurter](https://frankfurter.dev/v1/). Expone una API propia al backend Spring Boot y mantiene la llamada al proveedor fuera del navegador. Frankfurter no requiere API key.

## Ejecutar

Requiere Node.js 20 o superior.

```powershell
npm install
npm run start:dev
```

Escucha en `http://localhost:3000`. Opcionalmente copia `.env.example` a `.env` para personalizar `PORT` o `FRANKFURTER_BASE_URL`.

## Endpoints

- `GET /api/rates/USD/COP`: devuelve fecha, par de divisas y tasa.
- `GET /api/rates?base=USD&symbols=COP,EUR`: devuelve varias tasas.

El servicio valida códigos ISO de tres letras, limita la espera del proveedor y convierte errores de red/proveedor en respuestas HTTP claras.

## Arquitectura

`React/Vite -> Spring Boot (:8080) -> NestJS (:3000) -> Frankfurter`

El backend configura la URL del microservicio mediante `EXCHANGE_SERVICE_URL`. No se requiere clave ni secreto.
