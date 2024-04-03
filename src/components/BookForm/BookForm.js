import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { FaSpinner } from 'react-icons/fa';
import './BookForm.css';
import createBookWithId from '../../utils/createBookWithId';
import booksData from '../../data/books.json';
import { addBook, fetchBook } from '../../redux/slices/bookSlice';
import { setError } from '../../redux/slices/errorSlice';

const BookForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const isLoadingViaAPI = useSelector((state) => state.books.isLoadingViaAPI);
  const dispatch = useDispatch();

  const handleAddRandomBook = () => {
    const randomIndex = Math.floor(Math.random() * booksData.length);
    const randomBook = booksData[randomIndex];
    dispatch(addBook(createBookWithId(randomBook, 'random')));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && author) {
      dispatch(addBook(createBookWithId({ title, author }, 'manual')));
      setTitle('');
      setAuthor('');
    } else {
      dispatch(setError('You must fill title and author!'));
    }
  };

  const handleAddRandomBookViaAPI = () => {
    dispatch(fetchBook())
  };

  return (
    <div className='app-block book-form'>
      <h2>Add a New Movie</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label htmlFor="author">Director:</label>
          <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <button type='submit'>Add Movie</button>
        <button type='button' onClick={handleAddRandomBook}>Add Random</button>

        <button type='button' onClick={handleAddRandomBookViaAPI} disabled={isLoadingViaAPI}>
          {isLoadingViaAPI ? (
            <>
              <span>Loading Movie...</span>
              <FaSpinner className='spinner' />
            </>
          ) : 'Add Random via API'} </button>
      </form>
    </div>
  );
};

export default BookForm;