const FeeService = require('../services/fee')

class FeeController {

  static async getFeesList(req, res) {
    let pageNumber = Number.parseInt(req.query.page ? req.query.page : 1)
    let limit_size = Number.parseInt(req.query.limit || FeeService.QUERY_LIMIT_SIZE)
    let offset = pageNumber * limit_size - limit_size
    let search = req.query.search
    let fees, totalDocuments
    if (search) {
      fees = await FeeService.searchBy(search, {limit: limit_size, offset}) 
      totalDocuments = await FeeService.countMatchingDocuments(search)
    } else {
      fees = await FeeService.findAll({limit: limit_size, offset})
      totalDocuments = await FeeService.countMatchingDocuments()
    }
    let totalNumberOfPages = Math.ceil(await totalDocuments / limit_size)

    res.render('fees', {fees, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset, searchTerm: search })
  }

  static async createFeesPage(req, res) {
    res.render('fees-new')
  }

  static async createFee(req, res) {
    let dao = req.body
    try {
      await FeeService.create(dao)
      req.flash('success_msg', "Record added")
      res.redirect('/fees')
    } catch (err) {
      console.log(err)
      res.redirect('/fees')
    }
  }

  static async removeFee(req, res) {
    try {
      await FeeService.removeOne(req.params.fee_id)
      req.flash('success_msg', 'Document removed')
      res.redirect('/fees')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error removing record')
      res.redirect('/fees')
    }
  }

}

module.exports = FeeController