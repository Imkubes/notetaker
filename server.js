const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');


//using util to create promises when reading/writing file data
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./public'));


// API Route get request for all notes
app.get('/api/notes', (req, res) => {
    readFileAsync('./db/db.json', 'utf8').then(data => {
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    });
});
//Adding note route
app.post('/api/notes', (req, res) => {
    const note = req.body;
    readFileAsync('./db/db.json', 'utf8').then(data => {
        const notes = [].concat(JSON.parse(data));
        //adding an id value to new notes that increases by 1 for each new note
        note.id = notes.length + 1
        notes.push(note);
        return notes;
    }).then(notes => {
        //returning new note in json format to the db.json file
        writeFileAsync('./db/db.json', JSON.stringify(notes))
        res.json(note);
    });
});
//Deletion route for deleting notes
app.delete('/api/notes/:id', (req, res) => {
    //setting id to delete to the corresponding id value we created in the post route
    const idToDelete = parseInt(req.params.id);
    readFileAsync('./db/db.json', 'utf8').then(data => {
        const notes = [].concat(JSON.parse(data));
        const newNotesData = [];
        for (let i = 0; i<notes.length; i++) {
            if(idToDelete !== notes[i].id) {
                newNotesData.push(notes[i])
            };
        };
        return newNotesData;
    }).then(notes => {
        writeFileAsync('./db/db.json', JSON.stringify(notes));
        res.send('Success!');
    });
});

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


//Listen Route
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));