const mongoose = require ('mongoose');

const MONGO_URL = "";

mongoose.connection.once('open',()=>{
    console.log('MongoDB connection is ready');
})

mongoose.connection.error('error',(err)=>{
    console.log(err);
})

async function mongoConnect(){
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect(){
    console.log('hey');
    await mongoose.connection.close();
}

module.exports ={
    mongoConnect,
    mongoDisconnect
}