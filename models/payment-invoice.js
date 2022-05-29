const mongoose = require('mongoose')
const DBCounterModel = require('./db_counter')

const PaymentInvoiceSchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  invoice_number: {
    type: String,
  },
  student_reg_no: {
    type: String,
    required: true,
  },
  student_name: {
    type: String,
  },
  student_phone: String,
  name_of_payment: {
    type: String,
  },
  session: {
    type: String,
  },
  total_amount: {
    type: String,
  }
}, {timestamps: true})


async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

PaymentInvoiceSchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue("payment_invoices_id")
    this.invoice_number = 'ABP000' + this.serial_number
  }
  next()
})

module.exports = mongoose.model('payment_invoice', PaymentInvoiceSchema)
