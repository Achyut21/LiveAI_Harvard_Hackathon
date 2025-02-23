import mongoose, { model } from "mongoose";

const userstorage=new mongoose.Schema({
    address: {type:String},
    magicAPT: {type:String},
    
});

const userStorage=mongoose.model('userstorage',userstorage);

export default userStorage;