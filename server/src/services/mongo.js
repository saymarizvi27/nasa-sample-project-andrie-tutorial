const mongoose = require ('mongoose');

const MONGO_URL = "smongodb+srv://admin:admin@cluster0.znv9h.mongodb.net/nasa?retryWrites=true&w=majority";


mongoose.connection.once('open',()=>{
    console.log('MongoDB connection is ready');
})

// mongoose.connection.error('error',(err)=>{
//     console.log(err);
// })

async function mongoConnect(){
    await mongoose.connect(MONGO_URL.toString(),{
        useNewUrlParser: true,
        useUnifiedTopology : true,
    });
}


async function mongoDisconnect(){
    await mongoose.connection.close(true); 
}

module.exports ={
    mongoConnect,
    mongoDisconnect
}