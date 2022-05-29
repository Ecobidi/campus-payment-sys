const router = require('express').Router()
const MakePaymentController = require('../controllers/make-payment')

router.get('/', MakePaymentController.getMakePaymentPage)

router.post('/', MakePaymentController.processPayementPage)

module.exports = router
