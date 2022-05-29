const mongoose = require('mongoose')
const DBCounterModel = require("./db_counter")

let PaymentReceiptSchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  receipt_number: {
    type: String
  },
  name_of_payment: {
    type: String,
    required: true,
  },
  total_amount_paid: {
    type: Number,
    required: true,
  },
  // student: {
  //   type: mongoose.SchemaTypes.ObjectId
  // },
  student_name: {
    type: String,
  },
  student_reg_no: String,
  session: String,

}, {timestamps: {createdAt: true}})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

PaymentReceiptSchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue("payment_receipts_id")
    this.receipt_number = 'RCT000' + this.serial_number 
  }
  next()
})

module.exports = mongoose.model('payment_reciept', PaymentReceiptSchema)
