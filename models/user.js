const mongoose =require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    user_name: {type: String, required: true, maxLength: 100},
    password: {type: String, maxLength: 100},
    membership_status: {
        type: String,
        required: true,
        enum: ["Standard", "Elite", "Administrator"],
        default: "Standard"
    }
})

UserSchema.virtual('url').get(function () {
    return `/user/${this._id}`;
})

module.exports = mongoose.model('Users', UserSchema);