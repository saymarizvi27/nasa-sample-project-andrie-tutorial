const http = require('http');

const app = require('./app');

const mongoose = require ('mongoose');

const { loadPlanetData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
const MONGO_URL = "";

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
    console.log('here');
    server.listen(PORT, () => {
        console.log(`Listening on PORT:${PORT}`)
    });
}

startSever();
