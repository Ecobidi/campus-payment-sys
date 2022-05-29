const router = require('express').Router()
const PaymentListingController = require('../controllers/fee')

router.get('/', PaymentListingController.getFeesList)

router.get('/new', PaymentListingController.createFeesPage)

router.post('/new', PaymentListingController.createFee)

router.get('/remove/:fee_id', PaymentListingController.removeFee)

module.exports = router