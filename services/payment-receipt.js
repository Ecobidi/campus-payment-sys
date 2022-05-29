const ReceiptModel = require('../models/payment-receipt')

class ReceiptService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return ReceiptModel.findById(id)
  }

  static async findBySerialNumber(serial_number) {
    return ReceiptModel.findOne({serial_number})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await ReceiptModel.find({ $or: [{name_of_payment: pattern}, {student_name: pattern, }]}).skip(offset).limit(limit).sort('-_id')
    
    return docs
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return ReceiptModel.find().skip(offset).limit(limit).sort('-_id')
  }

  static async countMatchingDocuments(search = '') {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await ReceiptModel.count({ $or: [{name_of_payment: pattern}, {student_name: pattern, }]})
    } else {
      numberOfDocs = await ReceiptModel.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return ReceiptModel.create(dao)
  }

  static async updateOne(update) {
    return ReceiptModel.findByIdAndUpdate(update._id, {$set: update})
  }

  static async removeOne(serial_number) {
    return ReceiptModel.findOneAndDelete({serial_number})
  }

}

module.exports = ReceiptService