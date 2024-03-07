import { rejects } from 'assert';
import https from 'https';
import connectDb from "@/middleware/mongoose";
const PaytmChecksum = require('paytmchecksum/PaytmChecksum');
import Order from '@/models/Order';
import path from 'path';
import Product from '@/models/Product';
import pincodes from "/pincodes.json"


const handler = async (req, res) => {
    if (req.method == 'POST') {

        let cart = req.body.cart
        let product, sumTotal = 0;
        for (const item in cart) {
            sumTotal += cart[item].price * cart[item].qty;
            product = await Product.findOne({slug:item})

            if (req.body.subtotal <= 0) {
                res.status(200).json({success:false, "error":"Your Cart is Empty. Please Try Again", ClearCart: true})
                return
            }
            if (product.availableQty < cart[item].qty) {
                res.status(200).json({success:false, "error":"Some item in Your Cart are went Out of Stock. Please Try Again", ClearCart: true})
                return
            }
          
            if (product.price != cart[item].price) {
                res.status(200).json({success:false, "error":"The price have changed Please try again with fair price", ClearCart: true} )
                return
            }
        }
        if (sumTotal !== req.body.subtotal) {
            res.status(200).json({success:false, "error":"The price have changed Please try again with fair price"})
            return
        }
        if (!Object.keys(pincodes).includes(req.body.Pincode)) {
            res.status(200).json({success:false, "error":"Your Pincode is not Serviceable! Please try again", ClearCart: false})
            return
        }

        if (req.body.Pincode.length !== 6 || !Number.isInteger(Number(req.body.Pincode))) {
            res.status(200).json({success:false, "error":"Please Enter Your 6 digit Pincode. Please Try Again", ClearCart: false})
            return
        }
        if (req.body.phone.length !== 10 || !Number.isInteger(Number(req.body.phone))) {
            res.status(200).json({success:false, "error":"Please Enter Your 10 digit Phone Number.", ClearCart: false})
            return
        }
        
        let order = new Order({
            email:req.body.email,
            orderId:req.body.oid,
            address:req.body.address,
            city:req.body.city,
            name:req.body.name,
            state:req.body.state,
            phone:req.body.phone,
            amount:req.body.subtotal,
            products:req.body.cart
        })

        await order.save();

        if (req.body.subtotal == 0) {
            res.status(200).json({ success: false, "error": "Cart is Empty! Please choose some items and Comeback" })
        }

        const paytmParams = {
            body: {
                "requestType": "Payment",
                "mid": process.env.NEXT_PUBLIC_PAYTM_MID,
                "websiteName": "YOUR_WEBSITE_NAME",
                "orderId": req.body.oid,
                "callbackUrl": `${process.env.NEXT_PUBLIC_HOST}/api/posttransation`,
                "txnAmount": {
                    "value": req.body.subtotal,
                    "currency": "INR",
                },
                "userInfo": {
                    "custId": req.body.email,
                },
            }
        };

       const checksum = await PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.NEXT_PUBLIC_PAYTM_MKEY)

            paytmParams.head = {
                "signature": checksum
            };

            var post_data = JSON.stringify(paytmParams);

            const RequestAsyn = () => {
                return new Promise((resolve, rejects) => {
                    var options = {

                        // /* for Staging */
                        // hostname: 'securegw-stage.paytm.in',

                        /* for Production */
                        hostname: 'securegw.paytm.in',

                        port: 443,
                        path: `/theia/api/v1/initiateTransaction?mid=${process.env.NEXT_PUBLIC_PAYTM_MID}&orderId=${req.body.oid}`,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': post_data.length
                        }
                    };

                    var response = "";
                    var post_req = https.request(options, function (post_res) {
                        post_res.on('data', function (chunk) {
                            response += chunk;
                        });

                        post_res.on('end', function () {
                            let ress = JSON.parse(response).body
                            ress.success = true
                            resolve(ress)
                        });
                    });

                    post_req.write(post_data);
                    post_req.end();

                })
            }

            let myr = await RequestAsyn()
            res.status(200).json(myr)
       
        
}
}

export default connectDb(handler);