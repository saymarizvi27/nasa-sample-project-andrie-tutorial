const http = require('http');

const app = require('./app');

const mongoose = require ('mongoose');

const { loadPlanetData } = require('./models/planets.model');
const { saveStartLaunch } = require('./models/launches.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
const MONGO_URL = "smongodb+srv://admin:Tt6EDIOiwCQxUXc2@cluster0.znv9h.mongodb.net/nasa?retryWrites=true&w=majority";

mongoose.connection.once('open',()=>{
    console.log('MongoDB connection is ready');
})

mongoose.connection.error('error',(err)=>{
    console.log(err);
})
async function startSever(){
    await mongoose.connect(MONGO_URL);
    console.log('here');
    await loadPlanetData();
    await saveStartLaunch();
    console.log('here');
    server.listen(PORT, () => {
        console.log(`Listening on PORT:${PORT}`)
    });
}

startSever();
