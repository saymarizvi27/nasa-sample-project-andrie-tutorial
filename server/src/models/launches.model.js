const launches = require('./launches.mongo');
const planets = require('./planets.mongo');


const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: 100,
    mission: "Kepler Explorer",
    rocket: "Explorer IS1",
    launchDate: new Date("December 27, 2030"),
    target: 'Kepler-442 b',
    customer: ["ZMT", "NASA"],
    upcoming: true,
    success: true,
};



async function getAllLaunches() {
    const launcheList = await launches.find({
    }, {
        '_id': 0,
        '__v': 0
    });
    return launcheList;
}

async function saveStartLaunch() {
    await saveLaunch(launch);
}

async function saveLaunch(launch) {
    try {
        console.log(launch.target, 'This is launch');
        const planet = await planets.find({
            "keplerName": launch.target,
        });
        if (!planet || planet.length < 1) {
            throw new Error('No matching planets !');
        }
        
        launch.target = planet[0]._id;
        await launches.updateOne({
            flightNumber: launch.flightNumber
        }, launch, {
            upsert: true
        });
    }
    catch (err) {
        console.error(`Could not save planet ${err}`)
    }
}

async function addNewLaunch(launch) {
    const latestFlightNumber = await getLatestFlightNumber() + 1;
    
    const newLaunch = Object.assign(launch, {
            customers: ["ZMT", "NASA"],
            flightNumber: latestFlightNumber,
            success: true,
            upcoming: true
        });
    
    await saveLaunch(launch);
}

async function getLatestFlightNumber(){
    const latestLaunch = await launches
    .findOne({})
    .sort('-flightNumber');

    if (!latestLaunch){
       return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}
function existsLaunchId(launchId) {
    return launches.has(launchId);
}

function abortLaunchById(launchId) {
    const aboarted = launches.get(launchId);
    aboarted.upcoming = false;
    aboarted.success = false;
    return aboarted;
}


module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunchId,
    abortLaunchById,
    saveStartLaunch
};
