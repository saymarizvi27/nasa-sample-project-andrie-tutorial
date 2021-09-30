const { planets } = require('../../models/planets.model');

function getAllPlanets(req,res){
    console.log("hey123" ,planets);
    return res.status(200).json(planets);
}

module.exports = {
    getAllPlanets,
}