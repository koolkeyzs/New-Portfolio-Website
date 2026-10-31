import mongoose from "mongoose";

const connectDb = async (): Promise<void> => {
    try {

        await mongoose.connect(process.env.MONGODB_URI!)
        console.log("MongoDb connected succesfully")
        
    } catch (error) {
        console.error("MongoDB connection failed" , error)
        throw error;
        
    }
}

export default connectDb;


