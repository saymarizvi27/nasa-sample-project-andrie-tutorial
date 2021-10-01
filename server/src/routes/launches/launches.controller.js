const { launches }= require('../../models/launch.model');

function getAllLaunches(req,res){
    //with json Array works perfectly thats why we convert it into array from map
    return res.status(200).json(Array.from(launches.values()));
}

module.exports = {
    getAllLaunches ,
}
