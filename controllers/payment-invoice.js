const InvoiceService = require('../services/payment-invoice')
const StudentService = require('../services/student')
const FeeModel = require('../models/fee')

class InvoiceController {

  static async getInvoicesPage(req, res) {
    let pageNumber = Number.parseInt(req.query.page ? req.query.page : 1)
    let limit_size = Number.parseInt(req.query.limit || InvoiceService.QUERY_LIMIT_SIZE)
    let offset = pageNumber * limit_size - limit_size
    let search = req.query.search
    let invoices, totalDocuments
    if (search) {
      invoices = await InvoiceService.searchBy(search, {limit: limit_size, offset}) 
      totalDocuments = await InvoiceService.countMatchingDocuments(search)
    } else {
      invoices = await InvoiceService.findAll({limit: limit_size, offset})
      totalDocuments = await InvoiceService.countMatchingDocuments()
    }
    let totalNumberOfPages = Math.ceil(await totalDocuments / limit_size)

    res.render('payment-invoices', {invoices, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset, searchTerm: search })
  }

  static async displayInvoicePage(req, res) {
    let invoice = await InvoiceService.findBySerialNumber(req.params.invoice_serial_number)
    res.render('payment-invoice', {invoice})
  }

  static async generateInvoicePage(req, res) {
    let fees = await FeeModel.find()
    res.render('generate-invoice', { fees })
  }

  static async createPaymentInvoice(req, res) {
    let dao = req.body
    let fee = await FeeModel.findOne({serial_number: dao.fee})
    let sameInvoice = await InvoiceService.findSpecific(dao.reg_no, fee.name_of_payment, dao.session)
    if (sameInvoice) {
      res.redirect('/invoices/v/' + sameInvoice.serial_number)
      return
    }
    try {
      let student = await StudentService.findByRegNo(dao.reg_no)
      if(!student) throw (new Error('No matching student'))
      dao.student_reg_no = dao.reg_no
      dao.student_name = `${student.surname} ${student.first_name} ${student.middle_name}`
      dao.student_phone = student.phone
      dao.name_of_payment = fee.name_of_payment
      dao.total_amount = fee.total_amount
      let invoice = await InvoiceService.create(dao)
      req.flash('success_msg', "Record added")
      res.redirect('/invoices/v/' + invoice.serial_number)
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error Generating Invoice')
      res.redirect('/invoices')
    }
  }

  static async removeInvoice(req, res) {
    try {
      await InvoiceService.removeOne(req.params.payment_invoice_id)
      req.flash('success_msg', 'Document removed')
      res.redirect('/invoices')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error removing record')
      res.redirect('/invoices')
    }
  }

}

module.exports = InvoiceController