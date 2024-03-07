import connectDb from "@/middleware/mongoose";
import jsonwebtoken from "jsonwebtoken";
import User from "@/models/User";
var cryptoJs = require("crypto-js");

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            let token = req.body.token;
            let user = jsonwebtoken.verify(token, process.env.KEY_JWT);

            // Fix the typo in 'email'
            let dbuser = await User.findOne({ email: user.email });

            const bytes = cryptoJs.AES.decrypt(dbuser.password, process.env.KEY_SECKRET);
            const originalText = bytes.toString(cryptoJs.enc.Utf8);
            // console.log(originalText);

            if (originalText === req.body.password && req.body.npassword === req.body.cpassword) {
                // Update user password in the database
                await User.findOneAndUpdate({ email: dbuser.email, name:dbuser.name }, { password: cryptoJs.AES.encrypt(req.body.npassword, process.env.KEY_SECKRET).toString() }
                );

                res.status(200).json({ success: true });
                return
            } else {
                res.status(400).json({ success: false, error: "Passwords do not match" });
            }
        } catch (error) {
            console.error("Error updating password:", error);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    } else {
        res.status(400).json({ error: "Invalid method" });
    }
};

export default connectDb(handler);
