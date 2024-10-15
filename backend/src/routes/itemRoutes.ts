import { Router } from 'express';
import { getItems, addItem, editItem, deleteItem } from '../controllers/itemController';
import swaggerJsDoc from 'swagger-jsdoc'; // Importa swagger-jsdoc
import swaggerUi from 'swagger-ui-express'; // Importa swagger-ui-express

const router = Router();

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Items API',
      version: '1.0.0',
      description: 'API para gestionar ítems en DynamoDB',
    },
    servers: [
      {
        url: 'http://localhost:3001',
      },
    ],
  },
  apis: ['./src/routes/itemRoutes.ts'], // Ruta de los archivos donde se documentan las APIs
};

// Define los documentos de Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Documentación para obtener todos los ítems
/**
 * @swagger
 * /items:
 *   get:
 *     summary: Obtiene todos los ítems
 *     responses:
 *       200:
 *         description: Lista de ítems
 */
router.get('/', getItems);

// Documentación para agregar un nuevo ítem
/**
 * @swagger
 * /items:
 *   post:
 *     summary: Agrega un nuevo ítem
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ítem creado
 */
router.post('/', addItem);

// Documentación para editar un ítem existente
/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Edita un ítem existente
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del ítem a editar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ítem actualizado
 */
router.put('/:id', editItem);

// Documentación para eliminar un ítem existente
/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Elimina un ítem existente
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del ítem a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Ítem eliminado
 */
router.delete('/:id', deleteItem);

export default router;