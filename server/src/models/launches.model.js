const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');


const DEFAULT_FLIGHT_NUMBER = 100;



async function populateLaunches() {
    const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';
    let response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                },
            ]
        }
    });

    if (response.status !== 200) {
        console.log('Problem downloading launch data');
        throw new Error('Problem downloadin launch data');
    }

    const launchData = response.data.docs;
    for (const launchDoc of launchData) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        })
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            launchDate: launchDoc['date_local'],
            rocket: launchDoc['rocket']['name'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,

        }
        console.log(`This is launch data ${launch.flightNumber} and ${launch.mission}`);
        await saveLaunch(launch);
    }

}
async function getAllLaunches(skip, limit) {
    const launcheList = await launches.find({
    }, {
        '_id': 0,
        '__v': 0
    })
    .sort({flightNumber: 1})
    .skip(skip)
    .limit(limit);
  
    return launcheList;
}


async function loadLaunchData() {
    console.log('Donwloading launch data');
    const launchIdExist = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });
    if (!launchIdExist) {
        await populateLaunches();
    }
}

async function saveLaunch(launch) {
    try {
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
    console.log(launch.target, 'This is launch');
    const planet = await planets.find({
        "keplerName": launch.target,
    });

    if (!planet || planet.length < 1) {
        throw new Error('No matching planets !');
    }

    launch.target = planet[0]._id;
    const latestFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        customers: ["ZMT", "NASA"],
        flightNumber: latestFlightNumber,
        success: true,
        upcoming: true
    });

    await saveLaunch(launch);
}
async function findLaunch(filter) {
    return await launches.findOne(filter);
}

async function existsLaunchWithId(launchId) {
    return await findLaunch(
        {
            flightNumber: lauchId
        }
    )
}

async function getLatestFlightNumber() {
    const latestLaunch = await launches
        .findOne({})
        .sort('-flightNumber');

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}
async function existsLaunchId(launchId) {
    return await launches.findOne({ flightNumber: Number(launchId) });
}

async function abortLaunchById(launchId) {

    const aboarted = await launches.updateOne({
        flightNumber: Number(launchId)
    }, {
        upcoming: false,
        success: false,
    })
    return aboarted.modifiedCount === 1 && aboarted.acknowledged === true;
}


module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunchId,
    abortLaunchById,
    loadLaunchData,
};
