const { getAllLaunches , addNewLaunch , existsLaunchId ,abortLaunchById } = require('../../models/launch.model');

function httpGetAllLaunches(req,res){
    //with json Array works perfectly thats why we convert it into array from map
    return res.status(200).json(getAllLaunches());
}

function httpAbortLaunch(req,res){
    const id = Number(req.params.id);
    
    if (!existsLaunchId(id)){
        return res.status(404).json({
            error: 'Launch not found',
        });
    }
    const aborted = abortLaunchById(id);
    return res.status(200).json(aborted);
}


function httpAddNewLaunch(req,res){
    const launch = req.body;
    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
        return res.status(400).json({
            error: 'Missing required launch property',
        });
    }
    launch.launchDate = new Date(launch.launchDate);
    if(launch.launchDate.toString() === 'Invalid Date'){
        return res.status(400).json({
            error: 'Invalid launch date',
        });
    }
    addNewLaunch(launch);
    return res.status(201).json(launch);

}

module.exports = {
    httpGetAllLaunches ,
    httpAddNewLaunch,
    httpAbortLaunch,
}
