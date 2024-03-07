// getting-started.js
const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    phone:{type:String, required:true},
    password: {type:String, required:true },
    address: {type:String, default: "" },
    Pincode: {type:String, default: "" },
    phone: {type:String, default: "" }

}, {timestamp:true})


// export default mongoose.model("User", UserSchema)
// export default  mongoose.model.User || mongoose.model('User', UserSchema);
mongoose.models = {};
export default mongoose.model("User", UserSchema)

  