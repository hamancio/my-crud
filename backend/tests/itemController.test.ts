import request from 'supertest';
import { app } from '../server'; // Importa tu aplicación
import dynamoDB from '../src/config/dynamoDB'; // Mock de DynamoDB
import { v4 as uuidv4 } from 'uuid';
import http from 'http';

// Mock del cliente de DynamoDB
jest.mock('../src/config/dynamoDB');

// Configura el mock de DynamoDB
const dynamoDBMock = {
  send: jest.fn(),
};
dynamoDB.send = dynamoDBMock.send;

let server: http.Server;
let testPort = Math.floor(3000 + Math.random() * 1000); // Genera un puerto dinámico

jest.setTimeout(30000); // Timeout de 30 segundos

beforeAll(async () => {
  server = await app.listen(testPort, () => {
    console.log(`Servidor de pruebas iniciado en el puerto ${testPort}`);
  });
});

afterAll(async () => {
  if (server) {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) return reject(err);
        console.log('Servidor de pruebas cerrado');
        resolve();
      });
    });
  }
});

describe('Item Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
  });

  it('should fetch all items', async () => {
    const items = [{ id: '1', name: 'Item 1' }, { id: '2', name: 'Item 2' }];
    dynamoDBMock.send.mockResolvedValueOnce({ Items: items });

    const response = await request(app).get('/items');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(items);
  });

  it('should add a new item', async () => {
    const newItem = { id: uuidv4(), name: 'New Item' };
    dynamoDBMock.send.mockResolvedValueOnce({});

    const response = await request(app)
      .post('/items')
      .send({ name: newItem.name });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ ...newItem, id: expect.any(String) });
  });

  it('should edit an existing item', async () => {
    const updatedItem = { id: '123', name: 'Updated Item' };
    dynamoDBMock.send.mockResolvedValueOnce({ Attributes: updatedItem });

    const response = await request(app)
      .put('/items/123')
      .send({ name: updatedItem.name });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedItem);
  });

  it('should delete an item', async () => {
    dynamoDBMock.send.mockResolvedValueOnce({});

    const response = await request(app).delete('/items/123');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Ítem eliminado' });
  });
});