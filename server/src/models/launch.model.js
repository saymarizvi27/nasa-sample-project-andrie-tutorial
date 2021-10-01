const launches = new Map();

const launch = {
  flightNumber: 100,  
  mission: "Kepler Explorer",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  destination: "Kepler-422 b",
  customer: ["ZMT", "NASA"],
  upcoming : true,
  success: true
};

launches.set(launch.flightNumber,launch);

module.exports = {
   launches,
}