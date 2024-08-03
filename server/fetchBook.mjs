import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fetchBooks() {
  let books = [];
  for (let page = 1; page <= 50; page++) {  
    const response = await fetch(`https://openlibrary.org/subjects/science_fiction.json?limit=100&page=${page}`);
    const data = await response.json();
    
    const processedBooks = data.works.map((work, index) => {
      return {
        cover_id: work.cover_id || 0, 
        name: work.title,
        author: work.authors?.map(author => author.name).join(', '),
        date: work.first_publish_year ? new Date(work.first_publish_year, 0, 1) : new Date(), 
        edition_count: work.edition_count || 0, 
        url: `https://openlibrary.org${work.key}`,
        publish_year: work.first_publish_year || 0,
        availability: work.availability?.status === 'open' ? true : false
      };
    }).filter(book => book.cover_id);

    books = books.concat(processedBooks);
  }

  await prisma.book.createMany({
    data: books,
    skipDuplicates: true, 
  });

  console.log('Books data has been fetched and saved to the database');
}

fetchBooks().catch((error) => {
  console.error('Error fetching books data:', error);
}).finally(async () => {
  await prisma.$disconnect();
});

