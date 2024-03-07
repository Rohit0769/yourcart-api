// getting-started.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  orderId: { type: String, required: true },
  paymentInfo: { type: String, default: " " },
  products: { type: Object, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String},
  state: { type: String},
  name: { type: String, required: true },
  Pincode: { type: String},
  amount: { type: Number, required: true },
  transationId:{type:String},
  status: { type: String, default: "Initiated", required: true },
  Deliverystatus: { type: String, default: "unShipped", required: true },

}, { timestamp: true })

// export default mongoose.model("Order", OrderSchema)
export default mongoose.models.Order || mongoose.model('Order', OrderSchema);