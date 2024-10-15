import React from 'react';
import '../styles/ListItems.css';

interface ListItemsProps {
  items: any[];
  onEdit: (index: number, id: string, newItem: string) => void;
  onDelete: (index: number, id: string) => void;
}

const ListItems: React.FC<ListItemsProps> = ({ items, onEdit, onDelete }) => {
  const handleEdit = (index: number) => {
    const newItem = prompt('Editar ítem:', items[index].name);
    if (newItem !== null && newItem.trim()) {
      onEdit(index, items[index].id, newItem);
    }
  };

  return (
    <ul className="list-items">
      {items.map((item, index) => (
        <li key={item.id} className="list-item">
          <span>{item.name}</span>
          <div>
            <button className="edit-btn" onClick={() => handleEdit(index)}>
              Editar
            </button>
            <button className="delete-btn" onClick={() => onDelete(index, item.id)}>
              Eliminar
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ListItems;