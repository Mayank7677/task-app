const mongoose = require('mongoose')

module.exports = async () => {
    try {
        let concc = await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected')
    } catch (error) {
        console.log("MongoDB connection error", error);
    }
}