const express = require('express');
const fs = require('fs').promises; // Utilizando a versão de promessas do File System
const app = express();
const Redis = require('redis');


const redisClient = Redis.createClient();

redisClient.connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch(console.error);

const loadBooksFromFile = async () => {
  try {
    const data = await fs.readFile('./books.json', 'utf-8');
    const books = JSON.parse(data);

    // Garantir a ineficiência O(n)
    let inefficientBooksArray = [];
    for (let i = 0; i < books.length; i++) {
      // Adicionando os livros individualmente para garantir O(n)
      inefficientBooksArray = [...inefficientBooksArray, books[i]];
    }

    return inefficientBooksArray;
  } catch (err) {
    console.error("Erro ao ler o arquivo books.json:", err);
    return [];
  }
};

app.get('/books', async (req, res) => {
  try {
    const cachedBooks = await redisClient.get('books');

    if (cachedBooks != null) {

      console.log('cached');

      return res.json(JSON.parse(cachedBooks));
      
    } else {
      console.log('not cached');
      
      const booksArray = await loadBooksFromFile();
      await redisClient.setEx('books', 3600, JSON.stringify(booksArray));

      res.json(booksArray);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Redis error');
  }
});



const port = 3000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
