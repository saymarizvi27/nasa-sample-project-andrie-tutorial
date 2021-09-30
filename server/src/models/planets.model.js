const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');

const isHabitablePlanets = [];

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
        fs.createReadStream(path.join(__dirname,'..','..','data','cumulative_2021.09.18_04.13.03.csv'))
        //connects read to reading source to write source 
        //readable stream to writable stream
        .pipe(parse({
            comment: '#',
            columns: true,
        }))
        .on('data', (data) => {
            if (isHabitablePlanet(data)) {
                isHabitablePlanets.push(data);
            }
        })
        .on('error', (err) => {
            console.log(err);
            reject(err);
        })
        .on('end', () => {
            console.log(isHabitablePlanets.map((planet) => {
                return planet['kepler_name'];
            }));
            console.log('done');
            resolve();
        })
      
    })
}


module.exports = {
    loadPlanetData,
    planets: isHabitablePlanets,
};