import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fetchBooks() {
  let books = [];
  const coverIdSet = new Set();

  for (let page = 1; page <= 5; page++) {  
    try {
      const response = await fetch(`https://openlibrary.org/subjects/science_fiction.json?limit=1000&page=${page}`);
      if (!response.ok) {
        console.error(`Failed to fetch page ${page}: ${response.statusText}`);
        continue;
      }
      
      const data = await response.json();
      const processedBooks = data.works.map(work => {
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
      }).filter(book => book.cover_id && !coverIdSet.has(book.cover_id));

      processedBooks.forEach(book => coverIdSet.add(book.cover_id));

      books = books.concat(processedBooks);
      console.log(`Fetched and processed ${processedBooks.length} books from page ${page}`);
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
    }
  }

  console.log(`Total unique books processed: ${books.length}`);

  console.log('Cover IDs of processed books:', books.map(book => book.cover_id));

  try {
    const result = await prisma.book.createMany({
      data: books,
      skipDuplicates: true,
    });
    console.log(`Books data has been saved to the database. Rows inserted: ${result.count}`);
  } catch (error) {
    console.error('Error saving books to the database:', error);
    if (error.code === 'P2002') {
      console.error('Unique constraint failed:', error.meta.target);
    }
  } finally {
    await prisma.$disconnect();
  }
}

fetchBooks().catch((error) => {
  console.error('Error in fetchBooks function:', error);
});
