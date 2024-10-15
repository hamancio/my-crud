import axios from 'axios';

const API_URL = 'http://localhost:3001'; // URL del backend

export const fetchItems = async () => {
  const response = await axios.get(`${API_URL}/items`);
  return response.data;
};

export const addItem = async (name: string) => {
  const response = await axios.post(`${API_URL}/items`, { name });
  return response.data;
};

export const editItem = async (id: string, name: string) => {
  const response = await axios.put(`${API_URL}/items/${id}`, { name });
  return response.data;
};

export const deleteItem = async (id: string) => {
  const response = await axios.delete(`${API_URL}/items/${id}`);
  return response.data;
};