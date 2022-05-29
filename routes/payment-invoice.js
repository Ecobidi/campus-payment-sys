const router = require('express').Router()
const InvoiceController = require('../controllers/payment-invoice')

router.get('/', InvoiceController.getInvoicesPage)

router.get('/generate', InvoiceController.generateInvoicePage)

router.post('/generate', InvoiceController.createPaymentInvoice)

router.get('/v/:invoice_serial_number', InvoiceController.displayInvoicePage)

router.get('/remove/:payment_invoice_id', InvoiceController.removeInvoice)

module.exports = router