import React from 'react';
import AddItem from './components/AddItem';
import ListItems from './components/ListItems';
import ItemProvider, { useItems } from './context/ItemContext';
import './styles/App.css';

const App: React.FC = () => {
  const { items, addItem, editItem, deleteItem } = useItems();

  const handleAddItem = (newItem: string) => {
    console.log('Adding new item:', newItem);
    addItem(newItem);
  };

  const handleEditItem = (index: number, id: string, newItem: string) => {
    console.log(`Editing item at index ${index}:`, newItem);
    editItem(index, id, newItem);
  };

  const handleDeleteItem = (index: number, id: string) => {
    console.log(`Deleting item at index ${index}`);
    deleteItem(index, id);
  };

  return (
    <div className="container">
      <h1>Gestión CRUD</h1>
      <AddItem onAddItem={handleAddItem} />
      <ListItems items={items} onEdit={handleEditItem} onDelete={handleDeleteItem} />
    </div>
  );
};

const AppWithProvider: React.FC = () => (
  <ItemProvider>
    <App />
  </ItemProvider>
);

export default AppWithProvider;