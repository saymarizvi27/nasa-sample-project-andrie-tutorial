const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');

const planets = require('./planets.mongo');



function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

/* 
const promise = new Promise((resolve,reject)=>{
    resolve(42);
});
promise.then((result)=>{

});

const result = await promise ;

console.log(result);

*/

function loadPlanetData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'cumulative_2021.09.18_04.13.03.csv'))
            //connects read to reading source to write source 
            //readable stream to writable stream
            .pipe(parse({
                comment: '#',
                columns: true,
            }))
            .on('data', async (data) => {
                if (isHabitablePlanet(data)) {
                    //insert+update = upsert
                    await savePlanets(data);
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('end', async () => {
                const countPlanetsFound = (await getAllPlanets()).length; 
                console.log('done',countPlanetsFound);
                resolve();
            })

    })
}

async function getAllPlanets() {
    const planetList= await planets.find({  
    },{
        '_id':0,
        '__v':0
    });
    return planetList;
}
async function savePlanets(data){
    try{
    await planets.updateOne({
        keplerName: data.kepler_name
    },{
        keplerName: data.kepler_name
    },{
        upsert:true
    });
    }
    catch(err){
        console.error(`Could not save planet ${err}`)
    }
}
module.exports = {
    loadPlanetData,
    getAllPlanets,
};