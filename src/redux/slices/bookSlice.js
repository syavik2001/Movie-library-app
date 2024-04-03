import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import createBookWithId from '../../utils/createBookWithId';
import { setError } from "./errorSlice";

const initialState = {
  books: [],
  isLoadingViaAPI: false
};

// Функция для сохранения списка фильмов в localStorage
const saveBooksToLocalStorage = (books) => {
  localStorage.setItem('books', JSON.stringify(books));
};

// Функция для загрузки списка фильмов из localStorage
export const loadBooksFromLocalStorage = () => {
  const books = localStorage.getItem('books');
  return books ? JSON.parse(books) : [];
};

export const fetchBook = createAsyncThunk(
  'books/fetchBook',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get('https://645aa6b495624ceb21082f35.mockapi.io/movies');
      const randomIndex = Math.floor(Math.random() * data.length);
      return data[randomIndex];

    } catch (error) {
      thunkAPI.dispatch(setError(error.message));
      throw error;
    }

  }
);

const bookSlice = createSlice({
  name: "books",
  initialState: {
    books: loadBooksFromLocalStorage(), // Инициализация начального состояния из localStorage
    isLoadingViaAPI: false
  },
  reducers: {
    addBook: (state, action) => {
      state.books.push(action.payload);
      saveBooksToLocalStorage(state.books); // Сохранение списка в localStorage после добавления фильма
    },

    deleteBook: (state, action) => {
      state.books = state.books.filter((book) => book.id !== action.payload);
      saveBooksToLocalStorage(state.books); // Сохранение списка в localStorage после удаления фильма
    },

    toggleFavorite: (state, action) => {
      state.books.forEach((book) => {
        if (book.id === action.payload) {
          book.isFavorite = !book.isFavorite;
        }
      });
      saveBooksToLocalStorage(state.books);
    },

    clearAllBooks: (state) => {
      state.books = [];
      saveBooksToLocalStorage(state.books);
    }
  },
  extraReducers: (builder) => {

    builder.addCase(fetchBook.pending, (state) => {
      state.isLoadingViaAPI = true;
    });

    builder.addCase(fetchBook.fulfilled, (state, action) => {
      state.isLoadingViaAPI = false;
      if (action.payload.title && action.payload.author) {
        state.books.push(createBookWithId(action.payload, 'API'));
        saveBooksToLocalStorage(state.books);
      }
    });

    builder.addCase(fetchBook.rejected, (state) => {
      state.isLoadingViaAPI = false;
    });
  }
});



export const { addBook, deleteBook, toggleFavorite, clearAllBooks } = bookSlice.actions;

export default bookSlice.reducer;

