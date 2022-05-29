const PaymentInvoiceModel = require('../models/payment-invoice')

class InvoiceService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return PaymentInvoiceModel.findById(id)
  }

  static async findBySerialNumber(serial_number) {
    return PaymentInvoiceModel.findOne({serial_number})
  }

  static async findByInvoiceNumber(invoice_number) {
    return PaymentInvoiceModel.findOne({invoice_number})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await PaymentInvoiceModel.find({ $or: [{name_of_payment: pattern}, {student_name: pattern}]}).skip(offset).limit(limit).sort('-_id')
    
    return docs
  }

  static async findSpecific(student_reg_no, name_of_payment, session) {
    return PaymentInvoiceModel.findOne({student_reg_no, name_of_payment, session})
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return PaymentInvoiceModel.find().skip(offset).limit(limit).sort('-_id')
  }

  static async countMatchingDocuments(search = '') {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await PaymentInvoiceModel.count({ $or: [{name_of_payment: pattern}, {student_name: pattern}]})
    } else {
      numberOfDocs = await PaymentInvoiceModel.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return PaymentInvoiceModel.create(dao)
  }

  static async updateOne(update) {
    return PaymentInvoiceModel.findByIdAndUpdate(update._id, {$set: update})
  }

  static async removeOne(serial_number) {
    return PaymentInvoiceModel.findOneAndDelete({serial_number})
  }

}

module.exports = InvoiceService