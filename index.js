
const express = require('express')
const cors = require('cors');
require('dotenv').config()
const fs = require('fs')



const PORT = process.env.BASE_PORT




const app = express();

app.use(express.json());

app.use(cors());


const appendObject = async (obj, fileName) => {
    var baseFile = fs.readFileSync(fileName)
    var file = JSON.parse(baseFile);

    file.push(obj);

    var endFile = JSON.stringify(file);

    fs.writeFileSync(fileName, endFile);
}




app.get('/api/v1/senaste-nytt', async (req,res) => {

    let checkFile = fs.existsSync('./data/frontnews.json');

    if (checkFile) {
        fs.readFile('./data/frontnews.json', 'utf-8', (err, data) => {
            if (err) console.log(err);
            const jsonData = JSON.parse(data);


            res.status(200).json(jsonData);
        })



    } else {
        res.sendStatus(400);
    }


})


app.get('/api/v1/getById/:id', async (req, res) => {
    const param = req.params.id;

    fs.readFile('./data/allnews.json', 'utf-8', (err, data) => {
        if (err) console.log(err)

        const jsonData = JSON.parse(data);



        const findNewsById = jsonData.find(news => news.id === param);


        if (findNewsById) {
            res.json(findNewsById)
        }
        else (
            res.status(404).json({ error: 'Obejekt kunde ej hittas' })
        )
    })



})


app.post('/api/v1/news', async (req, res) => {

    const body = req.body;


    await appendObject(body, `./data/${body.category}.json`);
    await appendObject(body, `./data/allnews.json`);

    res.status(201).json({ message: 'Nyheten har sparats' })
})

// partial update
app.patch('/api/v1/update/:id', async (req, res) => {


    const id = req.params.id;
    const body = req.body


    const data = fs.readFileSync('./data/allnews.json', 'utf-8');
    const allnews = JSON.parse(data);

    const findNewsById = allnews.find((news => news.id === id));

    if (findNewsById) {

        switch (Object.keys(body)[0]) {
            case 'title':
                findNewsById.title = body.title;
                break;
            case 'text':
                findNewsById.text = body.text;
                break;
            case 'pictureLink':
                findNewsById.pictureLink = body.pictureLink;
                break;
            case 'time':
                findNewsById.time = body.time;
                break;
            case 'source':
                findNewsById.source = body.source;
                break;
            default:
                return res.status(400).json({ error: 'Invalid property' });
        }
    }



    fs.writeFile('./data/allnews.json', JSON.stringify(allnews), 'utf-8', (err) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Fel med att uppdatera JSON FILEN' })
        }

        res.json({ succes: true })


    });
});




// tech

app.get('/api/v1/teknik', async (req, res) => {

    let checkFile = fs.existsSync('./data/technews.json');


    if (checkFile) {
        fs.readFile('./data/technews.json', 'utf-8', (err, data) => {
            if (err) console.log(err);
            const jsonData = JSON.parse(data);


            res.status(200).json(jsonData);
        })



    } else {
        res.sendStatus(400);
    }


})


// Economy

app.get('/api/v1/ekonomi', async (req, res) => {

    let checkFile = fs.existsSync('./data/economynews.json');


    if (checkFile) {
        fs.readFile('./data/economynews.json', 'utf-8', (err, data) => {
            if (err) console.log(err);
            const jsonData = JSON.parse(data);


            res.status(200).json(jsonData);
        })



    } else {
        res.sendStatus(400);
    }


})


// Culture

app.get('/api/v1/kultur', async (req, res) => {

    let checkFile = fs.existsSync('./data/culturenews.json');



    if (checkFile) {
        fs.readFile('./data/culturenews.json', 'utf-8', (err, data) => {
            if (err) console.log(err);
            const jsonData = JSON.parse(data);


            res.status(200).json(jsonData);
        })



    } else {
        res.sendStatus(400);
    }


})



app.listen(PORT, () => { console.log(`Api is live on: ${PORT}`) });