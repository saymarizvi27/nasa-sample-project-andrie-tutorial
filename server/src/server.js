const http = require('http');

const app = require('./app');

const { mongoConnect } = require('./services/mongo');

const { loadPlanetData } = require('./models/planets.model');
const { saveStartLaunch , loadLaunchData } = require('./models/launches.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);


async function startSever(){
    await mongoConnect();
    await loadPlanetData();
    await saveStartLaunch();
    await loadLaunchData();

    server.listen(PORT, () => {
        console.log(`Listening on PORT:${PORT}`)
    });
}

startSever();
