import connectDb from "@/middleware/mongoose";
import jsonwebtoken from "jsonwebtoken";
import User from "@/models/User";
const handler = async (req, res) => {
if (req.method == 'POST') {
    let token = req.body.token;
    let user = jsonwebtoken.verify(token, process.env.KEY_JWT)
    let dbuser = await User.findOne({emai: req.body.email})
    const {name, email, address, Pincode, phone} = dbuser
    res.status(200).json({name, phone, email, address, Pincode})
    
    
}

else{
    res.status(400).json({error : "error"})

}




}

export default connectDb(handler);
