import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { BsBookmarkHeartFill, BsBookmarkHeart } from 'react-icons/bs';
import { deleteBook, toggleFavorite, clearAllBooks } from '../../redux/slices/bookSlice';
import { selectTitleFilter, selectAuthorFilter, selectOnlyFavoriteFilter } from '../../redux/slices/filterSlice';
import './BookList.css';

export const BookList = () => {
  const books = useSelector((state) => state.books.books);
  const titleFilter = useSelector(selectTitleFilter);
  const authorFilter = useSelector(selectAuthorFilter);
  const onlyFavoriteFilter = useSelector(selectOnlyFavoriteFilter);
  const dispatch = useDispatch();
  const handleDelete = (id) => {
    dispatch(deleteBook(id));
  };
  const handleToggleFavorite = (id) => {
    dispatch(toggleFavorite(id));
  };

  const filteredBooks = books.filter((book) => {
    const matchesTitle = book.title.toLowerCase().includes(titleFilter.toLowerCase());
    const matchesAuthor = book.author.toLowerCase().includes(authorFilter.toLowerCase());
    const matchesFavorite = onlyFavoriteFilter ? book.isFavorite : true;
    return matchesTitle && matchesAuthor && matchesFavorite;
  });

  const handleClearAllBooks = () => {
    // Очищаем список фильмов в Redux store
    dispatch(clearAllBooks());

    // Очищаем список фильмов в localStorage

  };

  const highlightMatch = (text, filter) => {
    if (!filter) return text;
    const regex = new RegExp(`(${filter})`, 'gi');
    return text.split(regex).map((substring, i) => {
      if (substring.toLowerCase() === filter.toLowerCase()) {
        return (
          <span key={i} className="highlight">
            {substring}
          </span>
        );
      }
      return substring;
    });
  };

  return (
    <div className='app-block book-list'>
      <h2>Movies List</h2>
      {books.length === 0 ? (
        <p>No movies available</p>
      ) : (<ul>
        {filteredBooks.map((book, i) => (
          <li key={book.id}>
            <div className='book-info'>{++i}. <strong>{highlightMatch(book.title, titleFilter)}</strong> by <i>{highlightMatch(book.author, authorFilter)}</i> ({book.source})
            </div>
            <span onClick={() => handleToggleFavorite(book.id)}>
              {book.isFavorite ? <BsBookmarkHeartFill className='star-icon' /> : <BsBookmarkHeart className='star-icon' />}
            </span>
            <div className="book-actions">
              <button onClick={() => handleDelete(book.id)}>Delete</button>
            </div>
          </li>))}
      </ul>
      )
      }
      {books.length > 0 && <button onClick={handleClearAllBooks}>Clear All movies</button>}
    </div>
  );
};