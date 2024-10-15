import React, { useState } from 'react';
import '../styles/AddItem.css';

interface AddItemProps {
  onAddItem: (name: string) => void;
}

const AddItem: React.FC<AddItemProps> = ({ onAddItem }) => {
  const [item, setItem] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item.trim()) {
      onAddItem(item);
      setItem('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-item-form">
      <input
        type="text"
        value={item}
        onChange={(e) => setItem(e.target.value)}
        placeholder="Agregar nuevo ítem"
        className="add-item-input"
      />
      <button type="submit" className="add-item-btn">
        Agregar
      </button>
    </form>
  );
};

export default AddItem;