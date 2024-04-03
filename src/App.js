import BookForm from './components/BookForm/BookForm';
import { BookList } from './components/BookList/BookList';
import { Filter } from './components/Filter/Filter';
import Error from './components/Error/error';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className='app-header'>
        <img src="free-icon-video-library-11344902.png" alt="logo" />
        <h1>Movie Library App</h1>
      </header>
      <main className="app-main">
        <div className="app-left-column">
          <BookForm />
        </div>
        <div className="app-right-column">
          <Filter />
          <BookList />
        </div>
      </main>
      <Error />
    </div>
  );
}

export default App;
