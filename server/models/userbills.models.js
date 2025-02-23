import mongoose, { model } from "mongoose";

const userbill=new mongoose.Schema({
    address: {type:String, required:true},
    merchant: {type:String, required:true},
    magicAPTEarned: {type:String, required:true},
});

const userBill=mongoose.model('userbill',userbill);

export default userBill;