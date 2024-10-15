import React from 'react';

interface DeleteItemProps {
  itemId: number;
  onDelete: (id: number) => void;
}

const DeleteItem: React.FC<DeleteItemProps> = ({ itemId, onDelete }) => {
  return (
    <button onClick={() => onDelete(itemId)}>
      Eliminar
    </button>
  );
};

export default DeleteItem;