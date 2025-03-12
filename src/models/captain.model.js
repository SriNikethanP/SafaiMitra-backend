import mongoose from 'mongoose';

const captainSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    username:{
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [ /^\S+@\S+\.\S+$/, 'Please enter a valid email' ]
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    vehicle: {
        number: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true,
        }
    },
    profilePic:{
        type:String,
        default:""
    }
})


const Captain = mongoose.model('captain', captainSchema)


export default Captain;