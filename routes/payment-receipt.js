const router = require('express').Router()
const ReceiptController = require('../controllers/payment-receipt')

router.get('/', ReceiptController.getReceiptsPage)

router.get('/new', ReceiptController.createReceiptPage)

router.post('/new', ReceiptController.createReceipt)

router.get('/v/:receipt_serial_number', ReceiptController.displayReceiptPage)

router.get('/remove/:payment_receipt_id', ReceiptController.removeReceipt)

module.exports = router