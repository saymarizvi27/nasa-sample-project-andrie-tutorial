// const launches = require('./launches.mongo');

const launches = new Map();


let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: "Kepler Explorer",
    rocket: "Explorer IS1",
    launchDate: new Date("December 27, 2030"),
    target: "Kepler-422 b",
    customer: ["ZMT", "NASA"],
    upcoming: true,
    success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
    return Array.from(launches.values());
}

function addNewLaunch(launch) {
    latestFlightNumber++;
    launches.set(
        latestFlightNumber,
        Object.assign(launch, {
            customers: ["ZMT", "NASA"],
            flightNumber: latestFlightNumber,
            success: true,
            upcoming: true
        })
    );
}

function existsLaunchId(launchId){
    return launches.has(launchId);
}

function abortLaunchById(launchId){
    const aboarted = launches.get(launchId);
    aboarted.upcoming = false;
    aboarted.success = false;
    return aboarted;
}


module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunchId,
    abortLaunchById
};
