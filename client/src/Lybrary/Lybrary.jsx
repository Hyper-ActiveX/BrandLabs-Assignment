import React, { useState, useEffect } from 'react';
import reorder from '../assets/reorder.png';
import searchIcon from '../assets/search.png';
import './Lybrary.css';
import BookModal from '../BookModals/BookModal';
import { getAllBooks, addBook, updateBook, deleteBook } from '../Middleware/Middleware';

const Lybrary = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(10);
  const [expandedUrl, setExpandedUrl] = useState({});
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalBook, setModalBook] = useState(null);
  const [totalBooks, setTotalBooks] = useState(0);
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [sortCycle, setSortCycle] = useState(0);

  useEffect(() => {
    fetchBooks(currentPage, booksPerPage);
  }, [currentPage, booksPerPage]);

  useEffect(() => {
    setDisplayedBooks(getDisplayedBooks());
  }, [books, search, sortConfig, currentPage, booksPerPage]);

  const fetchBooks = async (page, limit) => {
    try {
      const { books: fetchedBooks, totalBooks: fetchedTotalBooks } = await getAllBooks(page, limit);
      setBooks(fetchedBooks);
      setTotalBooks(fetchedTotalBooks);
      setDisplayedBooks(getDisplayedBooks(fetchedBooks));
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1); 
  };

  const handleSort = (key) => {
    let newSortCycle = (sortCycle + 1) % 3; 
    setSortCycle(newSortCycle);

    if (newSortCycle === 0) {
      setSortConfig(null);
    } else {
      const direction = newSortCycle === 1 ? 'asc' : 'desc';
      setSortConfig({ key, direction });
    }
    setCurrentPage(1); 
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchBooks(page, booksPerPage);
  };

  const handleBooksPerPage = (event) => {
    setBooksPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  const toggleExpandUrl = (id) => {
    setExpandedUrl((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectBook = (id) => {
    setSelectedBooks((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((bookId) => bookId !== id) : [...prevSelected, id]
    );
  };

  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id);
      fetchBooks(currentPage, booksPerPage);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleOpenModal = (book = null) => {
    setModalBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalBook(null);
  };

  const handleSubmitBook = async (book) => {
    try {
      if (modalBook) {
        await updateBook(modalBook.id, book);
      } else {
        await addBook(book);
      }
      fetchBooks(currentPage, booksPerPage);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting book:', error);
    }
  };

  const getDisplayedBooks = (booksToDisplay = books) => {
    const sortedBooks = [...booksToDisplay].sort((a, b) => {
      if (sortConfig) {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
      }
      return 0;
    });

    const filteredBooks = sortedBooks.filter((book) =>
      book.name.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    return filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  };

  const totalPages = Math.ceil(totalBooks / booksPerPage);

  const booksToMap = search || sortCycle !== 0 ? displayedBooks : books;

  return (
    <div className="book-page">
      <div className="container">
        <div className="controlerDiv">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search name, email etc..."
              value={search}
              onChange={handleSearch}
              className="search-input"
            />
            <img src={searchIcon} alt="Search icon" className="search-icon" />
          </div>
        </div>
        <div className="table-container">
          <table className="books-table">
            <thead>
              <tr>
                <th></th>
                <th>Id</th>
                <th>Cover Id</th>
                <th>Name</th>
                <th>Author</th>
                <th>Date</th>
                <th>Edition Count</th>
                <th>Link</th>
                <th>Publish Year</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {booksToMap.map((book) => (
                <tr key={book.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedBooks.includes(book.id)}
                      onChange={() => handleSelectBook(book.id)}
                    />
                  </td>
                  <td>
                    {book.id}
                    {selectedBooks.includes(book.id) && (
                      <div className="id_buttons">
                        <button
                          onClick={() => handleDeleteBook(book.id)}
                          style={{ background: 'red', fontSize: '0.7rem', padding: '0.2rem' }}
                          className="button"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleOpenModal(book)}
                          style={{ backgroundColor: 'green', fontSize: '0.7rem', padding: '3px' }}
                          className="button"
                        >
                          Update
                        </button>
                      </div>
                    )}
                  </td>
                  <td>{book.cover_id}</td>
                  <td>{book.name}</td>
                  <td>{book.author}</td>
                  <td>{book.date}</td>
                  <td>{book.edition_count}</td>
                  <td onClick={() => toggleExpandUrl(book.id)}>
                    {expandedUrl[book.id] ? book.url : `${book.url.substring(0, 5)}...`}
                  </td>
                  <td>{book.publish_year}</td>
                  <td>{book.availability ? 'Available' : 'Unavailable'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-controls">
          {currentPage !== 1 && (
            <i className="fa fa-angle-double-left" onClick={() => handlePageChange(currentPage - 1)}></i>
          )}
          <span>
            Page {currentPage} of {totalPages}
          </span>
          {currentPage !== totalPages && (
            <i className="fa fa-angle-double-right" onClick={() => handlePageChange(currentPage + 1)}></i>
          )}
          <select value={booksPerPage} onChange={handleBooksPerPage}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={50}>50</option>
          </select>
        </div>
        <button
          className="button"
          style={{ background: 'blue', position: 'fixed', bottom: '20px', right: '20px' }}
          onClick={() => handleOpenModal()}
        >
          Add Book
        </button>
      </div>
      <BookModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmitBook} book={modalBook} />
    </div>
  );
};

export default Lybrary;
