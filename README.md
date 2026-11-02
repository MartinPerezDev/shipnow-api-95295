# ShipNow API

API de logística construida con Node.js, Express y MongoDB. Esta versión integra la
base de las clases 1 y 2: configuración inicial, arquitectura por capas y generación
de datos ficticios.

## Entidades

La API trabaja únicamente con estas entidades:

- `User`: usuario del sistema. Roles disponibles: `admin`, `customer` y `store`.
- `Store`: tienda asociada a un usuario con rol `store`.
- `Order`: pedido asociado a un usuario `customer` y a un `store`.

No se incluyen entidades `delivery` ni `driver`.

## Instalación y configuración

```bash
npm install
```

Crear un archivo `.env` en la raíz:

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/shipnow
```

`MONGODB_URI` es obligatoria. El servidor carga las variables de entorno antes de
conectarse a MongoDB.

## Ejecución

```bash
npm run dev
```

Para ejecutar sin nodemon:

```bash
npm start
```

La API queda disponible en `http://localhost:8080`.

## Testing

La suite usa Mocha, Chai y Supertest. Se ejecuta desde la raíz:

```bash
npm test
```

Agregar `MONGODB_URI_TEST` al `.env` con una URI de MongoDB que apunte a la base
exclusiva y descartable `shipnow_95295_test`. `tests/env.js` activa `NODE_ENV=test`
solo para las pruebas; no hace falta cambiar el entorno a mano en el `.env`.

El setup comprueba el nombre de la base antes de limpiar usuarios, tiendas y
pedidos. La limpieza se ejecuta antes de cada test y al finalizar la suite.
Se prueban health, rutas inexistentes, creación y errores de pedidos, cambios
de estado válidos e inválidos, usuarios mock sin persistencia, logger y Swagger UI.
Los tests crean sus propios datos mediante `orderFixture` cuando los necesitan.

Para ejecutar solamente un caso:

```bash
npm test -- --grep "actualiza y persiste"
```

## Documentación con Swagger

Ejecutar `npm run dev` desde la raíz y abrir
[Swagger UI](http://localhost:8080/api/docs/) si `PORT=8080`.
Si el puerto es otro, reemplazarlo en la dirección. Swagger usa el puerto de
`src/config/index.js`. Al cambiar el YAML, reiniciar el servidor (`rs` en nodemon)
y recargar el navegador.

La configuración está en `src/config/swagger.js` y la documentación en un único
`src/docs/swagger.yaml`. Se incluyen usuarios, tiendas, pedidos, mocks,
`/health` y `/loggerTest`, con ejemplos de entradas, respuestas y errores.

### Probar con datos reales de tu base

Los IDs de Swagger son ilustrativos. `Try it out` ejecuta peticiones reales.

1. Crear un usuario con rol `customer` mediante `POST /api/users` y copiar su `_id`.
2. Crear otro usuario con rol `store`, usando un email diferente.
3. Crear la tienda en `POST /api/stores` con el ID de ese propietario en `owner`.
4. Usar el ID del cliente en `customer` y el ID de la tienda en `store` al crear el pedido.
5. Copiar el ID del pedido para consultar, cambiar su estado o eliminarlo.

También se puede cargar `POST /api/mocks/generateData` con
`{ "users": 2, "stores": 1, "orders": 2 }` y consultar los listados para obtener IDs.
La respuesta informa 3 usuarios (2 clientes y 1 propietario), 1 tienda y 2 pedidos.
Esta camada usa emails fijos en los mocks: repetir una carga puede producir duplicados.
Los GET de mocks solo generan datos en memoria; sus IDs no son relaciones persistidas.

### Particularidades documentadas

- Los GET de pedidos devuelven cliente y tienda como objetos poblados;
  crear, actualizar estado y eliminar devuelven sus IDs.
- Un ID inválido en usuarios o pedidos devuelve `400` con `INVALID_ID_MONGOOSE`.
- Los controladores de tiendas todavía responden `500` para sus errores esperados,
  sin `code`. Sus éxitos y los de mocks no incluyen `message`.
- Las cantidades de mocks son enteros no negativos; no hay un máximo configurado.
- Esta versión de pedidos no comprueba el rol del cliente ni impone cantidades o
  precios positivos. La documentación no anuncia esas validaciones como implementadas.
- Los schemas describen campos relevantes y permiten otras propiedades de los modelos.

## Arquitectura

```text
routes       -> define endpoints y delega
controllers  -> recibe request y construye response
services     -> contiene la lógica de negocio
repositories -> accede a MongoDB
models       -> define schemas de Mongoose
```

Ejemplo del flujo de un pedido:

```text
orders.router.js
  -> order.controller.js
  -> order.service.js
  -> order.repository.js
  -> order.model.js
```

La misma estructura se aplica a `user` y `store`.

## Respuestas

Respuesta exitosa:

```json
{
  "status": "success",
  "payload": {}
}
```

Respuesta de error:

```json
{
  "status": "error",
  "message": "Usuario no encontrado"
}
```

## Endpoints principales

### Health check

```http
GET /health
```

### Users

```http
GET    /api/users
GET    /api/users/:uid
POST   /api/users
PUT    /api/users/:uid
DELETE /api/users/:uid
```

Ejemplo de usuario:

```json
{
  "firstName": "Martina",
  "lastName": "Gomez",
  "email": "martina@test.com",
  "password": "123456",
  "role": "customer"
}
```

### Stores

```http
GET    /api/stores
GET    /api/stores/:sid
POST   /api/stores
PUT    /api/stores/:sid
DELETE /api/stores/:sid
```

Un store necesita un usuario propietario con rol `store`:

```json
{
  "name": "Kiosco Centro",
  "address": "Av. Siempre Viva 742",
  "owner": "ID_DEL_USUARIO_STORE"
}
```

### Orders

```http
GET    /api/orders
GET    /api/orders/:oid
POST   /api/orders
PUT    /api/orders/:oid/status
DELETE /api/orders/:oid
```

Ejemplo de pedido:

```json
{
  "customer": "ID_DEL_USUARIO_CUSTOMER",
  "store": "ID_DEL_STORE",
  "deliveryAddress": "Av. Siempre Viva 742",
  "items": [
    {
      "name": "Caja mediana",
      "quantity": 2,
      "price": 1500
    }
  ]
}
```

El service calcula el total automáticamente. El estado inicial es `created`.
Estados disponibles: `created`, `assigned`, `picked_up`, `in_transit`, `delivered` y
`cancelled`.

## Mocks

Los mocks generan datos dinámicos usando únicamente `User`, `Store` y `Order`. Cada
generación crea nuevos IDs. Los endpoints de prueba no guardan datos en MongoDB.

### Usuarios en memoria

```http
GET /api/mocks/mockingusers?qty=5
```

Si no se indica `qty`, genera 10 usuarios `customer`.

### Pedidos en memoria

```http
GET /api/mocks/mockingorders?qty=5
```

Genera usuarios `customer`, usuarios `store`, tiendas y pedidos relacionados sin
persistirlos.

### Persistir datos ficticios

```http
POST /api/mocks/generateData
```

Body opcional:

```json
{
  "users": 5,
  "stores": 2,
  "orders": 10
}
```

Sin body se generan 10 usuarios `customer`, 5 usuarios `store`, 5 stores y 10 orders.
El resultado de `users` incluye ambos tipos de usuario.

Los datos se persisten en este orden:

```text
users -> stores -> orders
```

Respuesta de ejemplo:

```json
{
  "status": "success",
  "payload": {
    "users": 7,
    "stores": 2,
    "orders": 10
  }
}
```

Al repetir la carga pueden producirse errores por emails duplicados, porque `email` es
único en el modelo `User`.

## Estructura relevante

```text
src/
  app.js
  server.js
  config/
  controller/
  mocks/
  models/
  repository/
  routes/
  service/
  utils/constants.js
```

La siguiente etapa puede incorporar manejo global de errores, validaciones más completas,
tests y documentación Swagger.
