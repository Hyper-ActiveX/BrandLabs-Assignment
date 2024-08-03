import React, { useEffect, useState, useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button } from '@mui/material';
import { getAllBooks, addBook, updateBook, deleteBook } from '../Middleware/Middleware';
import dayjs from 'dayjs';
import './BookTable.css';
import BookModal from './BookModals';

const BookTable = () => {
  const [books, setBooks] = useState([]);
  const [expandedUrl, setExpandedUrl] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBook, setCurrentBook] = useState({
    id: 0,
    cover_id: 0,
    name: '',
    author: '',
    date: '',
    edition_count: 0,
    url: '',
    publish_year: 0,
    availability: false,
  });
  const [page, setPage] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [limit, setLimit] = useState(100);

  useEffect(() => {
    fetchBooks(page + 1, limit);
  }, [page]);

  const fetchBooks = async (page, limit) => {
    try {
      const { books: booksData, totalBooks } = await getAllBooks(page, limit);
      setBooks(booksData);
      setTotalBooks(totalBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleOpenModal = (book = {}) => {
    setIsEditing(!!book.id);
    setCurrentBook(book.id ? { ...book, date: dayjs(book.date).format('YYYY-MM-DD') } : {
      id: 0,
      cover_id: 0,
      name: '',
      author: '',
      date: '',
      edition_count: 0,
      url: '',
      publish_year: 0,
      availability: false,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentBook({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentBook((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveBook = async () => {
    try {
      const bookData = {
        ...currentBook,
        cover_id: parseInt(currentBook.cover_id, 10),
        edition_count: parseInt(currentBook.edition_count, 10),
        publish_year: parseInt(currentBook.publish_year, 10),
        date: new Date(currentBook.date),
      };
      if (isEditing) {
        await updateBook(currentBook.id, bookData);
      } else {
        await addBook(bookData);
      }
      fetchBooks(page + 1, limit);
      handleCloseModal();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id);
      fetchBooks(page + 1, limit);
    } catch (error) {
      console.error(`Error deleting book with ID ${id}:`, error);
    }
  };

  const toggleExpandUrl = (id) => {
    setExpandedUrl((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 100 },
      { accessorKey: 'cover_id', header: 'Cover ID', size: 150 },
      { accessorKey: 'name', header: 'Name', size: 150 },
      { accessorKey: 'author', header: 'Author', size: 150 },
      { accessorKey: 'date', header: 'Date', size: 150 },
      { accessorKey: 'edition_count', header: 'Edition Count', size: 150 },
      {
        accessorKey: 'url',
        header: 'URL',
        size: 200,
        Cell: ({ cell }) => (
          <div onClick={() => toggleExpandUrl(cell.row.id)}>
            {expandedUrl[cell.row.id] ? cell.getValue() : `${cell.getValue().substring(0, 5)}...`}
          </div>
        ),
      },
      { accessorKey: 'publish_year', header: 'Publish Year', size: 150 },
      {
        accessorKey: 'availability',
        header: 'Availability',
        size: 150,
        Cell: ({ cell }) => (cell.getValue() ? 'Available' : 'Unavailable'),
      },
      {
        header: 'Actions',
        size: 150,
        Cell: ({ row }) => (
          <div>
            <Button onClick={() => handleOpenModal(row.original)}>Edit</Button>
            <Button onClick={() => handleDeleteBook(row.original.id)}>Delete</Button>
          </div>
        ),
      },
    ],
    [expandedUrl],
  );

  const table = useMaterialReactTable({
    columns,
    data: books,
    manualPagination: true,
    enableBottomToolbar: false,
  });

  const totalPages = Math.ceil(totalBooks / limit);

  return (
    <Box className="container">
      <MaterialReactTable table={table} />
      <div className="pagination-container">
      <div className="pagination-controls">
        {page !== 0 && (
          <i className="fa fa-angle-double-left" onClick={() => setPage(page - 1)}></i>
        )}
        <span>
          Page {page + 1} of {totalPages}
        </span>
        {page + 1 !== totalPages && (
          <i className="fa fa-angle-double-right" onClick={() => setPage(page + 1)}></i>
        )}
      </div>
      </div>
      <div className='add-book-container'>
        <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>Add Book</Button>
      </div>


      <BookModal
        open={modalOpen}
        onClose={handleCloseModal}
        isEditing={isEditing}
        book={currentBook}
        onInputChange={handleInputChange}
        onSave={handleSaveBook}
      />
    </Box>
  );
};

export default BookTable;
