
# MyCRUDApp - Full Stack Application (Front-end & Back-end)

## Descripción

MyCRUDApp es una aplicación web full-stack que permite realizar operaciones CRUD (Crear, Leer, Actualizar y Eliminar) a través de una interfaz de usuario en React y un back-end en Node.js, usando AWS DynamoDB como base de datos. Toda la aplicación está diseñada para correr localmente utilizando Docker, incluyendo una instancia local de DynamoDB.

## Requisitos Previos

Antes de iniciar, asegúrate de tener instalados los siguientes requisitos:

- [Node.js](https://nodejs.org/) - Version 14.x o superior.
- [npm](https://www.npmjs.com/) - Gestor de paquetes para Node.js.
- [Docker](https://www.docker.com/) - Para contenedores.

## Estructura del Proyecto

El proyecto sigue la siguiente estructura de carpetas:

```plaintext
my-crud-app/
├── backend/               # Código del back-end (Node.js, Express, DynamoDB)
│   ├── config/            # Configuración de DynamoDB
│   │   └── dynamoDB.ts
│   ├── controllers/       # Controladores del back-end
│   │   └── itemController.ts
│   ├── models/            # Modelos de datos
│   │   └── itemModel.ts
│   ├── routes/            # Rutas del API
│   │   └── itemRoutes.ts
│   ├── tests/             # Pruebas del backend con Jest
│   │   ├── itemController.test.ts
│   │   └── socket.test.ts
│   ├── app.ts             # Configuración inicial del back-end
│   ├── server.ts          # Servidor principal
│   ├── Dockerfile         # Dockerfile para el backend
│   ├── package.json       # Dependencias del backend
│   ├── package-lock.json
│   └── tsconfig.json      # Configuración de TypeScript
│
├── frontend/              # Código del front-end (React, TypeScript)
│   ├── public/            # Archivos estáticos
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/               # Código fuente del front-end
│   │   ├── components/    # Componentes reutilizables de React
│   │   ├── context/       # Context API
│   │   ├── hooks/         # Hooks personalizados
│   │   ├── pages/         # Páginas principales
│   │   ├── redux/         # Gestión de estado con Redux
│   │   ├── services/      # Servicios (API, etc.)
│   │   ├── styles/        # Estilos
│   │   ├── App.css        # Estilos principales de la app
│   │   └── App.tsx        # Componente principal del front-end
│   ├── Dockerfile         # Dockerfile para el frontend
│   ├── package.json       # Dependencias del frontend
│   └── package-lock.json
│
├── docker-compose.yml     # Docker Compose para levantar la app completa
├── README.md              # Este archivo
├── .env                   # Variables de entorno
└── .vscode/               # Configuración de VSCode
    └── settings.json
```

## Configuración del Entorno

1. **Clona el repositorio** en tu máquina local:

```bash
git clone https://github.com/tu-usuario/my-crud-app.git
cd my-crud-app
```

2. **Crea un archivo `.env`** en la raíz del proyecto con las siguientes variables de entorno:

```plaintext
# Backend Config
PORT=3001
DYNAMODB_ENDPOINT=http://dynamodb-local:8000
AWS_ACCESS_KEY_ID=local
AWS_SECRET_ACCESS_KEY=local
AWS_REGION=us-east-1

# Frontend Config
REACT_APP_API_URL=http://localhost:3001
```

## Instrucciones de Ejecución

### 1. Levantar la aplicación con Docker

Usa Docker Compose para levantar el back-end, el front-end y la base de datos DynamoDB local:

```bash
docker-compose up --build
```

Esto hará lo siguiente:

- El **back-end** se ejecutará en [http://localhost:3001](http://localhost:3001).
- El **front-end** se ejecutará en [http://localhost:3000](http://localhost:3000).
- DynamoDB estará disponible localmente en [http://localhost:8000](http://localhost:8000).

### 2. Correr las pruebas

Para ejecutar las pruebas del back-end con Jest:

```bash
cd backend
npm run test
```

Asegúrate de que todos los servicios estén corriendo en segundo plano (Docker) antes de ejecutar las pruebas.

## Conexión WebSocket

La aplicación incluye soporte para **WebSocket**. El servidor WebSocket está configurado en el back-end para comunicar eventos en tiempo real entre el cliente y el servidor.

- Los WebSockets se activan en la misma URL del backend en el puerto `3001`.
- El front-end tiene la lógica para conectarse al WebSocket para recibir actualizaciones en tiempo real de los ítems CRUD.

## Tecnologías Utilizadas

- **Node.js**: Servidor back-end utilizando Express.
- **React**: Front-end para la UI.
- **AWS DynamoDB**: Base de datos NoSQL para el almacenamiento de ítems.
- **Docker**: Contenerización de la aplicación.
- **Jest**: Framework de pruebas para Node.js.
- **Socket.IO**: Comunicación en tiempo real.

## Desplegando en Producción

Cuando estés listo para desplegar la aplicación, sigue estos pasos:

1. **Construir la aplicación**:

```bash
docker-compose build
```

2. **Correr la aplicación en modo de producción**:

```bash
docker-compose up
```

3. Si necesitas escalar los servicios, puedes modificar `docker-compose.yml` y ajustar las configuraciones según tu infraestructura.

## Notas Finales

- Asegúrate de que todos los servicios en Docker estén corriendo correctamente y que no haya conflictos de puertos.
- Revisa las configuraciones de la base de datos DynamoDB en caso de usar una instancia en AWS en lugar de la configuración local.
