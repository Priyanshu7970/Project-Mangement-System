

import { connect } from "mongoose"

const dbConnect = async() => { 
    const MONGODB_URI = process.env.MONGODB_URI; 

    if (!MONGODB_URI) {
        throw new Error("FATAL: MONGODB_URI is undefined. Check your .env.local file.");
    }

    await connect(MONGODB_URI).then(()=>{
        console.log("MongoDB connected...");
    })
}

export default dbConnect;