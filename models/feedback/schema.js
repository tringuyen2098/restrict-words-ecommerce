const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedBackSchema = new Schema({
    word: {type: String, unique: true},
    group: {type: Number},
    otherGroup: {type: String},
    date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Feedback', FeedBackSchema);