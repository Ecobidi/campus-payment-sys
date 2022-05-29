const ReceiptService = require('../services/payment-receipt')

class ReceiptController {

  static async getReceiptsPage(req, res) {
    let pageNumber = Number.parseInt(req.query.page ? req.query.page : 1)
    let limit_size = Number.parseInt(req.query.limit || ReceiptService.QUERY_LIMIT_SIZE)
    let offset = pageNumber * limit_size - limit_size
    let search = req.query.search
    let receipts, totalDocuments
    if (search) {
      receipts = await ReceiptService.searchBy(search, {limit: limit_size, offset}) 
      totalDocuments = await ReceiptService.countMatchingDocuments(search)
    } else {
      receipts = await ReceiptService.findAll({limit: limit_size, offset})
      totalDocuments = await ReceiptService.countMatchingDocuments()
    }
    let totalNumberOfPages = Math.ceil(await totalDocuments / limit_size)

    res.render('receipts', {receipts, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset, searchTerm: search })
  }

  static async displayReceiptPage(req, res) {
    let receipt = await ReceiptService.findBySerialNumber(req.params.receipt_serial_number)
    res.render('payment-receipt', {receipt})
  }

  static async createReceiptPage(req, res) {
    res.render('receipts-new')
  }

  static async createReceipt(req, res) {
    let dao = req.body
    try {
      await ReceiptService.create(dao)
      req.flash('success_msg', "Receipt added")
      res.redirect('/receipts')
    } catch (err) {
      console.log(err)
      res.redirect('/receipts')
    }
  }

  static async removeReceipt(req, res) {
    try {
      let doc = await ReceiptService.removeOne(req.params.payment_receipt_id)
      req.flash('success_msg', 'Receipt removed')
      res.redirect('/receipts')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error removing record')
      res.redirect('/receipts')
    }
  }

}

module.exports = ReceiptController