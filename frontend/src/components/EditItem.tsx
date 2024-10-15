import React, { useState } from 'react';

interface EditItemProps {
  item: string;
  onEditItem: (newItem: string) => void;
}

const EditItem: React.FC<EditItemProps> = ({ item, onEditItem }) => {
  const [newItem, setNewItem] = useState(item);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      onEditItem(newItem);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Editar ítem"
      />
      <button type="submit">Actualizar</button>
    </form>
  );
};

export default EditItem;