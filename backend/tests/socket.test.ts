import { Server } from 'socket.io';
import { createServer } from 'http';
import { io } from 'socket.io-client';

describe('WebSocket Server Tests', () => {
  let server: any;
  let socketClient: any;

  beforeAll((done) => {
    const httpServer = createServer();
    const ioServer = new Server(httpServer);

    ioServer.on('connection', (socket) => {
      socket.on('new_item', (data) => {
        if (!data.id || !data.name) {
          socket.emit('error', 'Faltan campos id o name.');
          return;
        }
        socket.emit('new_item_broadcast', data);
      });
    });

    httpServer.listen(3002, () => {
      server = httpServer;
      socketClient = io('http://localhost:3002');
      done();
    });
  });

  afterAll((done) => {
    socketClient.disconnect();
    server.close(done);
  });

  it('Should broadcast new item to all clients', (done) => {
    const testItem = { id: '123', name: 'Test Item' };

    socketClient.on('new_item_broadcast', (data: any) => {
      expect(data).toEqual(testItem);
      done();
    });

    socketClient.emit('new_item', testItem);
  });

  it('Should return error if missing fields', (done) => {
    socketClient.on('error', (message: any) => {
      expect(message).toBe('Faltan campos id o name.');
      done();
    });

    socketClient.emit('new_item', { name: 'Test Item' });
  });
});