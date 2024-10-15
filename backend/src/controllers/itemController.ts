import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import dynamoDB from '../config/dynamoDB';
import { ScanCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { ReturnValue } from '@aws-sdk/client-dynamodb';

// Obtener todos los ítems
export const getItems = async (req: Request, res: Response): Promise<void> => {
  const params = {
    TableName: 'Items',
  };

  console.log('Fetching all items from DynamoDB...');

  try {
    const data = await dynamoDB.send(new ScanCommand(params));
    console.log('Items fetched:', data.Items);
    res.json(data.Items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Error obteniendo los ítems' });
  }
};

// Agregar un ítem
export const addItem = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  const params = {
    TableName: 'Items',
    Item: {
      id: uuidv4(),
      name,
    },
  };

  console.log(`Adding new item: ${name}...`);

  try {
    await dynamoDB.send(new PutCommand(params));
    console.log('Item added successfully:', params.Item);
    res.status(201).json(params.Item);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Error agregando el ítem' });
  }
};

// Editar un ítem
export const editItem = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;

  const params = {
    TableName: 'Items',
    Key: { id },
    UpdateExpression: 'set #name = :name',
    ExpressionAttributeNames: { '#name': 'name' },
    ExpressionAttributeValues: { ':name': name },
    ReturnValues: ReturnValue.ALL_NEW,
  };

  console.log(`Editing item with ID: ${id}...`);

  try {
    const data = await dynamoDB.send(new UpdateCommand(params));
    console.log('Item updated successfully:', data.Attributes);
    res.status(200).json(data.Attributes);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Error actualizando el ítem' });
  }
};

// Eliminar un ítem
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const params = {
    TableName: 'Items',
    Key: { id },
  };

  console.log(`Deleting item with ID: ${id}...`);

  try {
    await dynamoDB.send(new DeleteCommand(params));
    console.log('Item deleted successfully');
    res.status(200).json({ message: 'Ítem eliminado' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Error eliminando el ítem' });
  }
};