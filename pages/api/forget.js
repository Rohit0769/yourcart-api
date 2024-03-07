import Forget from "@/models/Forget";
import User from "@/models/User";

export default function handler(req, res) {

    if (req.body.sendMail) {
        
  
    let token = "siihjhjhdjsnjchjdsnuihvnsnifnsdukjsndnjdskndusikfnds"
    let forget = new Forget({
        email:req.body.email,
        token:token
    })

    let email = ` We have sent you this email in response to your request to reset your password on CodesWare.com. 

    <br/><br/>

    To reset your password, please follow the link below:

    <a href="http://localhost:3000/forget?token=${token}">Click Here to reset your password</a>

    <br/><br/>

    We recommend that you keep your password secure and not share it with anyone.If you feel your password has been compromised, you can change it by going to your My Account Page and Change Your Password

    <br/><br/>`
}
else{

}
    res.status(200).json({success: true });
  }
  