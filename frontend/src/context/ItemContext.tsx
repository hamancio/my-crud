import React, { createContext, useContext, useReducer, useEffect, Dispatch } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

interface Item {
  id: string;
  name: string;
}

interface ItemState {
  items: Item[];
}

interface Action {
  type: 'ADD_ITEM' | 'EDIT_ITEM' | 'DELETE_ITEM' | 'LOAD_ITEMS';
  payload?: Item | Item[];
  index?: number;
}

interface ItemContextType {
  items: Item[];
  addItem: (name: string) => Promise<void>;
  editItem: (index: number, id: string, name: string) => Promise<void>;
  deleteItem: (index: number, id: string) => Promise<void>;
  dispatch: Dispatch<Action>;
}

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export const useItems = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItems debe ser utilizado dentro de un ItemProvider');
  }
  return context;
};

const itemReducer = (state: ItemState, action: Action): ItemState => {
  switch (action.type) {
    case 'LOAD_ITEMS':
      return { items: action.payload as Item[] };
    case 'ADD_ITEM':
      return { items: [...state.items, action.payload as Item] };
    case 'EDIT_ITEM':
      if (action.index !== undefined) {
        const updatedItems = [...state.items];
        updatedItems[action.index] = action.payload as Item;
        return { items: updatedItems };
      }
      return state;
    case 'DELETE_ITEM':
      return {
        items: state.items.filter((_, i) => i !== action.index),
      };
    default:
      return state;
  }
};

const initialState: ItemState = { items: [] };

const ItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(itemReducer, initialState);
  let socket: Socket;

  useEffect(() => {
    socket = io('http://localhost:3001'); 
    socket.on('new_item_broadcast', (item: Item) => {
      dispatch({ type: 'ADD_ITEM', payload: item });
    });

    socket.on('update_item_broadcast', (updatedItem: Item) => {
      const index = state.items.findIndex((item) => item.id === updatedItem.id);
      if (index !== -1) {
        dispatch({ type: 'EDIT_ITEM', index, payload: updatedItem });
      }
    });

    socket.on('delete_item_broadcast', (id: string) => {
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        dispatch({ type: 'DELETE_ITEM', index });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [state.items]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:3001/items');
        dispatch({ type: 'LOAD_ITEMS', payload: response.data });
      } catch (error) {
        console.error('Error fetching items', error);
      }
    };
    fetchItems();
  }, []);

  const addItem = async (name: string) => {
    try {
      const response = await axios.post('http://localhost:3001/items', { name });
      dispatch({ type: 'ADD_ITEM', payload: response.data });
      socket.emit('add_item', response.data);
    } catch (error) {
      console.error('Error adding item', error);
    }
  };

  const editItem = async (index: number, id: string, name: string) => {
    try {
      const response = await axios.put(`http://localhost:3001/items/${id}`, { name });
      dispatch({ type: 'EDIT_ITEM', index, payload: response.data });
      socket.emit('update_item', response.data); 
    } catch (error) {
      console.error('Error editing item', error);
    }
  };

  const deleteItem = async (index: number, id: string) => {
    try {
      await axios.delete(`http://localhost:3001/items/${id}`);
      dispatch({ type: 'DELETE_ITEM', index });
      socket.emit('delete_item', id); 
    } catch (error) {
      console.error('Error deleting item', error);
    }
  };

  return (
    <ItemContext.Provider value={{ items: state.items, addItem, editItem, deleteItem, dispatch }}>
      {children}
    </ItemContext.Provider>
  );
};

export default ItemProvider;