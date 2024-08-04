import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const AddBook = async (req, res) => {
  const { cover_id, name, author, date, edition_count, url, publish_year, availability } = req.body;
  try {
    const existingBook = await prisma.book.findUnique({
      where: { cover_id },
    });

    if (existingBook) {
      return res.status(409).json({ error: 'Book with the same details already exists' });
    }

    const newBook = await prisma.book.create({
      data: {
        cover_id,
        name,
        author,
        date: new Date(date),
        edition_count,
        url,
        publish_year,
        availability
      },
    });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: 'Error adding book', details: error.message });
  }
};

const DeleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.book.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error : 'Error while deleting books or it might not exist'});
  }
};

const UpdateBook = async (req, res) => {
  const { id } = req.params;
  const { cover_id, name, author, date, edition_count, url, publish_year, availability } = req.body;


  try {
    const updatedBook = await prisma.book.update({
      where: { id: parseInt(id) },
      data: {
        cover_id,
        name,
        author,
        date: new Date(date),
        edition_count,
        url,
        publish_year,
        availability
      },
    });
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: 'Error updating book', details: error.message });
  }
};

const GetBook = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
    });
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching book', details: error.message });
  }
};

const GetAllBooks = async (req, res) => {
  const { page = 1, limit = 50 , search = ''} = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const searchQuery = search.toLowerCase();

  try {
    const books = await prisma.book.findMany({
      where: {
        name: {
          contains: searchQuery,
          mode: 'insensitive'
        }
      },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
    });
    const totalBooks = await prisma.book.count({
      where: {
        name:{
          contains: searchQuery,
          mode: 'insensitive'
        }
      }
    });
    res.status(200).json({ books, totalBooks, page: pageNum, limit: limitNum });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books', details: error.message });
  }
};

export { AddBook, DeleteBook, UpdateBook, GetBook, GetAllBooks };
