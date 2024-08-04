import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getAllBooks = async (page = 1, limit = 50, search = '') => {
  try {
    const response = await axios.get(`${API_URL}/getallbooks`, {
      params: { page, limit, search },
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const getBookById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/getbook/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching book with ID ${id}:`, error);
    throw error;
  }
};

export const addBook = async (book) => {
  try {
    console.log(book);
    const response = await axios.post(`${API_URL}/addbook`, book);
    console.log("added book", response.data)
    return response.data;
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

export const updateBook = async (id, book) => {
  try {
    const response = await axios.put(`${API_URL}/updatebook/${id}`, book);
    return response.data;
  } catch (error) {
    console.error(`Error updating book with ID ${id}:`, error);
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/deletebook/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting book with ID ${id}:`, error);
    throw error;
  }
};
