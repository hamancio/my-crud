import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define el tipo de los ítems que manejarás en el estado
interface ItemState {
  items: string[];
}

// Estado inicial explícito
const initialState: ItemState = {
  items: [],
};

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<string>) => {
      state.items.push(action.payload);
    },
    editItem: (state, action: PayloadAction<{ index: number; newItem: string }>) => {
      const { index, newItem } = action.payload;
      state.items[index] = newItem;
    },
    deleteItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((_, i) => i !== action.payload);
    },
  },
});

export const { addItem, editItem, deleteItem } = itemSlice.actions;
export default itemSlice.reducer;