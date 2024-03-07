// getting-started.js
const mongoose = require('mongoose');


const ForgetSchema = new mongoose.Schema({
    userid: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    token: {type:String, required:true }

}, {timestamp:true})


// export default mongoose.model("Forget", ForgetSchema)
// export default  mongoose.model.Forget || mongoose.model('Forget', ForgetSchema);
mongoose.models = {};
export default mongoose.model("Forget", ForgetSchema)

  