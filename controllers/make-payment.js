const InvoiceService = require('../services/payment-invoice')
const ReceiptService = require('../services/payment-receipt')

class MakePayment {
  static async getMakePaymentPage(req, res) {
    let invoice_number = req.query.invoice_number
    if (!invoice_number) {
      return res.render('make-payment', { invoice_available: false })
    }
    let invoice = await InvoiceService.findByInvoiceNumber(invoice_number)
    if (!invoice) {
      req.flash('error_msg', 'Invalid Invoice Number')
      return res.redirect('/make-payment')
    }
    res.render('make-payment', { invoice, invoice_available: true })
  }

  static async processPayementPage(req ,res) {
    let dao = req.body
    try {
      let invoice = await InvoiceService.findByInvoiceNumber(dao.invoice)
      if (!invoice) {
        req.flash('error_msg', 'Error Processing Payment: Invalid Invoice Number')
        return res.redirect('/make-payment')
      } 
      if (dao.total_amount_paid < invoice.total_amount) {
        req.flash('error_msg', 'Insufficient Amount: Minimum Amount is ' + invoice.total_amount)
        return res.redirect('/make-payment')
      }
      dao.student_reg_no = invoice.student_reg_no
      dao.student_name = invoice.student_name
      dao.session = invoice.session
      dao.name_of_payment = invoice.name_of_payment
      await ReceiptService.create(dao)
      req.flash('success_msg', 'Payment Successfully Processed')
      res.redirect('/receipts')
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'Error Processing Payment')
      res.redirect('/make-payment')
    }
  }
}

module.exports = MakePayment