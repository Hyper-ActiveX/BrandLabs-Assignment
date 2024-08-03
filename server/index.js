import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bookRoute from './src/routes/book.routes.js';

dotenv.config();

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/", bookRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running on Port : ", PORT);
});


