const mongoose = require('mongoose');

const URL = 'mongodb+srv://apchaudhary6695:anand8126@cluster0.m0uykuj.mongodb.net/test';

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB Connected!");
}).catch((err) => {
    console.error('MongoDB Connection Error:', err);
});

module.exports = mongoose;
