
import mongoose from "mongoose";

export const addressSchema = new mongoose.Schema({
  userId : { type : mongoose.Schema.Types.ObjectId , ref: "user", required : true},
  firstName : { type : String , required : true},
    lastName : { type : String , required : true},
    email : { type : String , required : true},
    street : { type : String , required : true},
    city : { type : String , required : true},
    state : { type : String , required : true},
    zipcode : { type : Number, required : true},
    country : { type : String , required : true},
    phone : { type : String , required : true}, 
}, {timestamps : true})

const Address= mongoose.models.address ||  mongoose.model('Address',addressSchema)

export default Address;