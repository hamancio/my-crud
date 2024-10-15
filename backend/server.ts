import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';
import itemRoutes from './src/routes/itemRoutes';
import dynamoDB from './src/config/dynamoDB';
import {
  ListTablesCommand,
  CreateTableCommandInput,
  CreateTableCommand,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb';

const app = express();
const port = process.env.PORT || 3001;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use('/items', itemRoutes);

// Ruta básica
app.get('/', (req: Request, res: Response) => {
  res.send('Servidor funcionando...',);
});

// Crear tabla si no existe en DynamoDB
const createTableIfNotExists = async () => {
  try {
    const tableList = await dynamoDB.send(new ListTablesCommand({}));
    if (tableList.TableNames && tableList.TableNames.includes('Items')) {
      return;
    }

    const params: CreateTableCommandInput = {
      TableName: 'Items',
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
    };

    const command = new CreateTableCommand(params);
    await dynamoDB.send(command);
  } catch (err) {
    console.error('Error creando/verificando la tabla "Items":', err);
  }
};

createTableIfNotExists();

// WebSockets
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Crear un nuevo ítem
  socket.on('new_item', async (data) => {
    if (!data.id || !data.name) {
      socket.emit('error', 'Faltan campos id o name.');
      return;
    }

    const params = {
      TableName: 'Items',
      Item: {
        id: { S: data.id },
        name: { S: data.name }
      },
    };

    try {
      await dynamoDB.send(new PutItemCommand(params));
      io.emit('new_item_broadcast', data);
    } catch (err) {
      console.error('Error guardando ítem en DynamoDB:', err);
      socket.emit('error', 'Error guardando el ítem.');
    }
  });

  // Obtener un ítem
  socket.on('get_item', async (id) => {
    if (!id) {
      socket.emit('error', 'El campo id es requerido.');
      return;
    }

    const params = {
      TableName: 'Items',
      Key: { id: { S: id } }
    };

    try {
      const item = await dynamoDB.send(new GetItemCommand(params));
      socket.emit('get_item_response', item.Item);
    } catch (err) {
      console.error('Error obteniendo ítem de DynamoDB:', err);
      socket.emit('error', 'Error obteniendo el ítem.');
    }
  });

  // Actualizar un ítem
  socket.on('update_item', async (data) => {
    if (!data.id || !data.name) {
      socket.emit('error', 'Faltan campos id o name.');
      return;
    }

    const params = {
      TableName: 'Items',
      Key: { id: { S: data.id } },
      UpdateExpression: 'set #name = :name',
      ExpressionAttributeNames: { '#name': 'name' },
      ExpressionAttributeValues: { ':name': { S: data.name } }
    };

    try {
      await dynamoDB.send(new UpdateItemCommand(params));
      io.emit('update_item_broadcast', data);
    } catch (err) {
      console.error('Error actualizando ítem en DynamoDB:', err);
      socket.emit('error', 'Error actualizando el ítem.');
    }
  });

  // Eliminar un ítem
  socket.on('delete_item', async (id) => {
    if (!id) {
      socket.emit('error', 'El campo id es requerido.');
      return;
    }

    const params = {
      TableName: 'Items',
      Key: { id: { S: id } }
    };

    try {
      await dynamoDB.send(new DeleteItemCommand(params));
      io.emit('delete_item_broadcast', id);
    } catch (err) {
      console.error('Error eliminando ítem de DynamoDB:', err);
      socket.emit('error', 'Error eliminando el ítem.');
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Iniciar el servidor
httpServer.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

export { app };