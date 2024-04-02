const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: {type: String, required: true, maxLength: 100},
    timestamp: {type: Date, required: true},
    message: {type: String, required: true, maxLength: 1000},
    userId: ({type: Schema.Types.ObjectId, ref: 'Users'}),
})

module.exports = mongoose.model('Messages', MessageSchema);