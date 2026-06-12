# Copa Mundial FIFA — API REST

API REST construida con **Node.js**, **Express**, **SQLite** y **Zod** que expone información sobre 11 ediciones de la Copa Mundial FIFA (1986–2026).

---

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | 22.x | Runtime |
| Express | 4.x | Servidor HTTP |
| sqlite3 | 5.x | Base de datos SQLite |
| Zod | 3.x | Validaciones de entrada |
| ES Modules | — | `"type": "module"` |

---

## Instalación

```bash
npm install
```

---

## Base de datos (seed)

Ejecutar **antes** de iniciar el servidor para crear la tabla e insertar los 11 mundiales:

```bash
npm run seed
```

---

## Ejecución

```bash
npm start
```

El servidor queda disponible en: `http://localhost:4321`

---

## Estructura del proyecto

```
TAREA2--MULTIMEDIOS/
│
├── database/
│   ├── connection.js        ← Conexión SQLite + helpers async (run/get/all/exec)
│   ├── init.js              ← Script seed: crea tabla e inserta datos
│   └── CREATE.SQL           ← DDL de la tabla mundiales
│
├── data/
│   └── mundiales.json       ← 11 ediciones de la Copa Mundial FIFA
│
├── public/
│   ├── imagenes/            ← Imágenes .jpg accesibles por URL
│   └── capturas/            ← Evidencias de pruebas (se agregan después)
│
├── src/
│   ├── app.js               ← Configura Express, middlewares y rutas
│   ├── controllers/
│   │   └── mundial.controller.js   ← Lógica de cada endpoint
│   ├── routes/
│   │   └── mundial.routes.js       ← Definición de rutas GET
│   ├── schemas/
│   │   └── mundial.schema.js       ← Esquema Zod para /search/:text
│   └── middleware/
│       └── notFound.middleware.js  ← Respuesta 404 catch-all
│
├── index.js                 ← Punto de entrada (puerto 4321)
├── package.json
├── README.md
├── REFERENCIAS.md
└── .gitignore
```

---

## Tabla de rutas

| Método | Ruta | Descripción | Código HTTP |
|---|---|---|---|
| GET | `/` | Información de la API | 200 |
| GET | `/mundiales` | Lista resumida (nombre, anio, sede, campeon, slug) | 200 |
| GET | `/mundiales?include=full` | Lista completa con todos los campos | 200 |
| GET | `/mundial/:slug` | Mundial por slug | 200 / 404 |
| GET | `/campeon/:pais` | Slugs de mundiales ganados por un país | 200 |
| GET | `/random` | Mundial aleatorio | 200 |
| GET | `/search/:text` | Búsqueda en múltiples campos | 200 / 400 |
| GET | `/imagenes/*` | Imágenes servidas como archivos estáticos | 200 / 404 |

---

## Códigos HTTP

| Código | Significado | Cuándo ocurre |
|---|---|---|
| **200 OK** | Petición exitosa | Recurso encontrado correctamente |
| **400 Bad Request** | Validación fallida | `/search/ab` — texto menor a 3 caracteres |
| **404 Not Found** | Recurso o ruta no existe | Slug inexistente, ruta no definida |

---

## Pruebas con xh

Asegúrate de que el servidor esté corriendo (`npm start`) y el seed ejecutado (`npm run seed`).

### Lista de mundiales (resumida)
```bash
xh GET :4321/mundiales
```

### Lista completa
```bash
xh GET :4321/mundiales include==full
```

### Mundial por slug (200)
```bash
xh GET :4321/mundial/qatar-2022
```

### Slug inexistente (404)
```bash
xh GET :4321/mundial/inexistente
```

### Campeón por país (case-insensitive)
```bash
xh GET :4321/campeon/Argentina
```

### Mundial aleatorio
```bash
xh GET :4321/random
```

### Búsqueda válida (200)
```bash
xh GET :4321/search/final
```

### Búsqueda inválida — menos de 3 caracteres (400)
```bash
xh GET :4321/search/ab
```

---

## Cómo probar imágenes

Abre cualquiera de estas URLs directamente en el navegador:

```
http://localhost:4321/imagenes/mexico-1986.jpg
http://localhost:4321/imagenes/italia-1990.jpg
http://localhost:4321/imagenes/estados-unidos-1994.jpg
http://localhost:4321/imagenes/francia-1998.jpg
http://localhost:4321/imagenes/corea-japon-2002.jpg
http://localhost:4321/imagenes/alemania-2006.jpg
http://localhost:4321/imagenes/sudafrica-2010.jpg
http://localhost:4321/imagenes/brasil-2014.jpg
http://localhost:4321/imagenes/rusia-2018.jpg
http://localhost:4321/imagenes/qatar-2022.jpg
http://localhost:4321/imagenes/mundial-2026.jpg
```

Las imágenes se sirven directamente con `express.static`. No existe ninguna vista HTML.

---

## Evidencias

Las capturas de pantalla de las pruebas se guardan en `public/capturas/`.

---

## Mundiales incluidos

| # | Edición | Sede | Campeón |
|---|---|---|---|
| 1 | 1986 | México | Argentina |
| 2 | 1990 | Italia | Alemania Occidental |
| 3 | 1994 | Estados Unidos | Brasil |
| 4 | 1998 | Francia | Francia |
| 5 | 2002 | Corea del Sur y Japón | Brasil |
| 6 | 2006 | Alemania | Italia |
| 7 | 2010 | Sudáfrica | España |
| 8 | 2014 | Brasil | Alemania |
| 9 | 2018 | Rusia | Francia |
| 10 | 2022 | Qatar | Argentina |
| 11 | 2026 | México, EE. UU. y Canadá | Por definir |
