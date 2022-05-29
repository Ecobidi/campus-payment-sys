const FeeModel = require('../models/fee')

class FeeService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return FeeModel.findById(id)
  }

  static async findBySerialNumber(serial_number) {
    return FeeModel.findOne({serial_number})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await FeeModel.find({ $or: [{name_of_payment: pattern}]}).skip(offset).limit(limit)
    
    return docs
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return FeeModel.find().skip(offset).limit(limit)
  }

  static async countMatchingDocuments(search = '') {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await FeeModel.count({ $or: [{name_of_payment: pattern}]})
    } else {
      numberOfDocs = await FeeModel.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return FeeModel.create(dao)
  }

  static async updateOne(update) {
    return FeeModel.findByIdAndUpdate(update._id, {$set: update})
  }

  static async removeOne(serial_number) {
    return FeeModel.findOneAndDelete({serial_number})
  }

}

module.exports = FeeService