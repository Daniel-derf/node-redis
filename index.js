const express = require('express')
const app = express()


app.get('/start', (req, res) => {

  res.send('TESTE')

})

app.get('/books', (req, res) => {

  const books = Array.from({ length: 99999 }, (_, index) => ({
    id: index + 1,
    name: `book ${index + 1}`
  }));

  res.json(books)
})



const port = 3000
app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})