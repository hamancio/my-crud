// src/swagger/swagger.ts

import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Configuración de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'My CRUD API',
            version: '1.0.0',
            description: 'API para manejar operaciones CRUD.',
        },
        servers: [
            {
                url: 'http://localhost:3001', // Cambia esto si es necesario
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Ruta a los archivos de rutas
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app: any) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export default setupSwagger;