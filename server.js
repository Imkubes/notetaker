const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3000;
const util = require('util');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

//HTML Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/api/notes', (req, res) => {
    readFileAsync('./db/db.json', 'utf8').then(data => {
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    });
});




app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));