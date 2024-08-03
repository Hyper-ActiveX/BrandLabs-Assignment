import { Router } from 'express';
import { AddBook , DeleteBook , UpdateBook, GetBook, GetAllBooks} from '../controllers/book.js';

const bookRoute = Router();

bookRoute.post('/addbook', AddBook);
bookRoute.delete('/deletebook/:id', DeleteBook);
bookRoute.put('/updatebook/:id', UpdateBook);
bookRoute.get('/getbook/:id', GetBook);
bookRoute.get('/getallbooks', GetAllBooks);

export default bookRoute;
