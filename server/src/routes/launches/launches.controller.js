const { getAllLaunches, addNewLaunch, existsLaunchId, abortLaunchById } = require('../../models/launches.model');

const {
    getPagination
} = require('../../services/query');

async function httpGetAllLaunches(req, res) {
    const { skip, limit } = getPagination(req.query);
    //with json Array works perfectly thats why we convert it into array from map
    return res.status(200).json(await getAllLaunches(skip, limit));
}

async function httpAbortLaunch(req, res) {
    const id = Number(req.params.id);
    const launchId = await existsLaunchId(id);
    if (!launchId) {
        return res.status(404).json({
            error: 'Launch not found',
        });
    }
    const aborted = await abortLaunchById(id);
    if (!aborted) {
        return res.status(400).json({
            error: 'Launch not aborted',
        });
    }
    return res.status(200).json({
        ok: true
    });
}


async function httpAddNewLaunch(req, res) {
    const launch = req.body;
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'Missing required launch property',
        });
    }
    launch.launchDate = new Date(launch.launchDate);
    if (launch.launchDate.toString() === 'Invalid Date') {
        return res.status(400).json({
            error: 'Invalid launch date',
        });
    }
    await addNewLaunch(launch);
    return res.status(201).json(launch);

}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}
