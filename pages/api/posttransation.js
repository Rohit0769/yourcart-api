import Order from '@/models/Order';
import Product from '@/models/Product';
import connectDb from "@/middleware/mongoose";
import PaytmChecksum from 'paytmchecksum';
import React, { useEffect } from 'react';
const handler = async (req, res) => {

  let order;
 

  var paytmParams = {};
  var paytmChecksum = ""

  const received_data = req.body;
  for (const key in received_data) {
    if (key == "CHECKSUMHASH") {
      paytmChecksum = received_data[key]
    } else {
      paytmParams[key] = received_data[key]
    }
  }
  // order = Order.findOne({orderId : req.body.orderId})

  let isValidchecksum = PaytmChecksum.verifySignature(paytmParams, process.env.NEXT_PUBLIC_PAYTM_MKEY, paytmChecksum);
  if (!isValidchecksum) {
    res.status(500).send("Some error Occured")

  }

  if (req.body.STATUS == 'TXN_SUCCESS') {
  order = await Order.findOneAndUpdate({ orderId: req.body.ORDERID }, { status: "PAID", paymentInfo: JSON.stringify(req.body), transationId: req.body.TXNID })
  console.log(order)

  let products = order.products
  for (const slug in products) {
    await Product.findOneAndUpdate({ slug: slug }, { $inc: { "availableQty": -products[slug].qty } })
  }
}
  else if (req.body.STATUS == 'PENDING') {
     order = await Order.findOneAndUpdate({ orderId: req.body.orderId }, { status: "PAID", paymentInfo: JSON.stringify(req.body), transationId:req.body.TXNID })
    }

  res.redirect('/order?clearCart=1&id=' + order._id, 200)

}

export default connectDb(handler);
