import connectDb from "@/middleware/mongoose";
import jsonwebtoken from "jsonwebtoken";
import User from "@/models/User";
const handler = async (req, res) => {
if (req.method == 'POST') {
    let token = req.body.token;
    let user = jsonwebtoken.verify(token, process.env.KEY_JWT)
    let dbuser = await User.findOneAndUpdate({emai: req.body.email}, {address: req.body.address, Pincode: req.body.Pincode, phone: req.body.phone, name: req.body.name})
    res.status(200).json({success: true})
    
    
}

else{
    res.status(400).json({error : "error"})

}




}

export default connectDb(handler);
