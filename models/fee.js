const mongoose = require('mongoose')
const DBCounterModel = require("./db_counter")

let FeeSchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  name_of_payment: {
    type: String,
    required: true,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
}, {timestamps: {createdAt: true}})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

FeeSchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue("fees_id")
  }
  next()
})

module.exports = mongoose.model('fee', FeeSchema)
